# Rescue Node - Solo Validator Access Tech Spec

This document will serve as a technical specification for a project with the goal of allowing solo validators access to the [Rocket Rescue Node](https://rescuenode.com/).

As with the original project, the main priority will be around identity management for MEV/tips theft prevention.

## Changes
### credentials

The [credentials](https://github.com/Rocket-Rescue-Node/credentials) library will be updated to change the proto spec for the `Credential` message.

```protobuf
message Credential {
	bytes node_id = 1; // 20 bytes representing the Node address
	int64 timestamp = 2; // UTC epoch time the credential was issued
}
```
will change to 
```protobuf
enum OperatorType {
	OT_ROCKETPOOL = 0; // Issued to a RP NO via a signature from their node wallet.
	OT_SOLO = 1; // Issued to a solo validator via a signature from their 0x01 withdrawal address.
}

message Credential {
	bytes address = 1; // 20 bytes representing the Node address, or if a solo validator, the withdrawal adress.
	int64 timestamp = 2; // UTC epoch time the credential was issued.
	OperatorType operator_type = 3; // The type of Node Operator for whom the credential was issued.
}
```

These messages are used across the stack to identify the user for whom we process traffic, and critically, rate-limit their access.

### rescue-api

[rescue-api](https://github.com/Rocket-Rescue-Node/rescue-api)'s primary responsibility is creating new `AuthenticatedCredential` messages according to the predetermined rate limit rules. It currently verifies the validator's ownership by requiring a signed message from the Rocket Pool node wallet. In order to support solo validators, it needs to be updated to accept a **signed message from the validator's 0x01 withdrawal address** instead.

This means that rescue-api will need a view of all validators active on the Beacon Chain, which will be provided to it by rescue-proxy.

When generating the credentials, it will keep a separate table for solo validators, and be subject to a **separate ruleset.**  
Solo validators may have reduced usage credits (when compared to the 4 annual, 15 day credits given to Rocket Pool node operators).

- Credentials with `OperatorType = OT_SOLO` may be issued to Rocket Pool node wallets if they are a 0x01 address, subject to the solo validator rate limits. Allnodes users, for instance, may use the same wallet for solo validators and minipools.
- Credentials with `OperatorType = OT_ROCKETPOOL` may be issued to Rocket Pool node wallets even if they are a 0x01 address, subject to the Rocket Pool rate limits, provided the message is signed by the node wallet, as usual.

To differentiate, the API will have a **separate route for solo validators vs Rocket Pool node operators.** 

### rescue-proxy

1) [rescue-proxy](https://github.com/Rocket-Rescue-Node/rescue-proxy) will now have to provide rescue-api with a gRPC service for 0x01 credential queries.  
rescue-api needs this in order to ensure that the wallet used to request a credential is in fact the withdrawal address for at least one validator.  
This should be developed in a way that makes real-time sacrifices in order to minimize load on the beacon node (eg, cache all the validators from the latest `justified` state).
2) rescue-proxy must differentiate between `operator_type` credentials. When `operator_type=OT_SOLO`, instead of validating that the fee recipient is set to the correct address (fee distributor vs smoothing pool), we will **validate that the fee recipient is set to the address of the 0x01 credential.** This means solo validators who wish to use the rescue node **must use their withdrawal address as their fee recipient**.
3) rescue-proxy should support a different expiry window for solo validator credentials, which are subject to a distinct rate limiting ruleset.

### guarded-beacon-proxy

Ideally, [this library](https://github.com/Rocket-Rescue-Node/guarded-beacon-proxy) does not need to be changed, though there may be some quality of life updates.

### rescue-ui

The bulk of the work will fall in [rescue-ui](https://github.com/Rocket-Rescue-Node/rescue-ui).

1) The landing page at https://rescuenode.com will have to ask if the user is requesting access for a solo validator or a Rocket Pool node.
2) We will use an open-source library to allow the solo operator to connect their 0x01 wallet to the website. We will advise against connecting a cold wallet. Unfortunately, the solo validator needs to prove custody of the withdrawal address, and this is the cleanest solution. We will take this opportunity to recommend that the solo validator use a hardware wallet (or better) as their withdrawal address.
3) Once connected, the solo validator will be able to **sign EIP-191 data** with their withdrawal wallet which is automatically populated with a message of the format:
```
Rescue Node `date +%s`
```
(where `date +%s` expands to a Unix timestamp in UTC).

4. rescue-ui will request a credential from rescue-api, and render instructions for each of the 5 supported validator clients on how to connect, plus a 6th tab for eth-docker users.

### infrastructure

Tweaks may be made here to separate solo validator traffic from Rocket Pool traffic, with the goal of being able to prioritize traffic from Rocket Pool nodes. Generally, though, **solo validator support will happen at the software layer**, so **no additional resources should be required**.

### miscellaneous

Metrics are collected across the platform and should, wherever possible, include a new `solo` label.
