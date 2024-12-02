# Rocket Pool Rescue Node Tech Spec

This document describes the technical implementation details of a secure and broadly useful temporary fallback
node for Rocket Pool Node operators.

## Requirements

  1. **DDoS Protection**
  
  * If, at any one point in time, a large number of Node Operators are relying on the rescue node,
    it becomes a vector for attack- a malicious actor can take those Node Operators offline by
    DDoSing the rescue node. We should protect, to the best of our abilities, against this.
  2. **Compatibility with each available Consensus Client that supports split mode** (currently lighthouse, prysm and teku)
 
  * Currently, prysm only works with a prysm fallback.
    Teku only works with a teku fallback.
    Lighthouse works with teku, but doppelganger detection must be disabled.
  3. **Available to Rocket Pool Node Operators**
  
  * Any Node Operator should be able to seamlessly use the rescue node in an emergency.
    Non Node Operators should not have access, to reserve capacity for Rocket Pool.
  4. **Self-serve**
  
  * Node Operators can enable the rescue node permissionlessly
  5. **(Reverse) hybrid mode support**
  
  * A node operator who has solo validators should be able to use the rescue node.
    As a courtesy, we should allow them to use it for their solo validators as well.
  6. **Usage limiting**
  
  * A node operator shouldn't be able to use the rescue node outside of emergencies.
    To prevent this, it should shut access off with a lockout period after a certain duration.
  7. **Fee recipient validation**
  
  * We shouldn't suborn the theft of tips/MEV. We should validate that a node operator using
    the rescue node has correctly configured their fee recipient to either their fee distributor,
    the smoothing pool, or the rEth address.
    
## Non-requirements
  1. **Choose-your-own mev-boost relays**
  
  * The relays are determined by the rescue node, so Node Operators will have no say in which relays are used.
    Node Operators who do not agree with the relays selected by the maintainers have the option of disabling mev-boost, so long as the protocol allows it. It may not be possible to force Node Operators to enable mev boost in order to use the rescue node, so compliance will be best-effort.
  2. **High Availability**
  
  * We should try to maintain good service, but these nodes will need to undergo maintenance/pruning.
  3. **Decentralization**
  
  * The rescue node will be centralized. It's feasible to do this in a decentralized manner, but
    the complexity of the project becomes untenable.
  4. **Trustlessness**
  
  * Node Operators using the rescue node acknowledge that they are trusting its maintainers not to steal tips
    or MEV. The maintainers will not be able to steal their keys or funds.

## Existing Rescue Node Comparison
||Existing|Proposed|
|---|---|---|
|DDOS Protection|Yes|Yes|
|CC Compatibility|Partial|Full|
|Available to RP NOs in SP|Yes|Yes|
|Available to RP NOs with MEV-boost|Yes|Yes|
|Choose-your-own MEV-boost Relays|No|No|
|Available to non-mev-boost NOs, non-SP NOs|No|Yes|
|Self Serve|No|Yes|
|Hybrid Mode Support|Partial|Yes|
|Reverse Hybrid Mode Support|Partial|Yes|
|Limits usage to prevent reliance|No|Yes|
|Fee Recipient Validation|Partial|Yes|
|Trustless|No|No|

## Implementation

The existing rescue node uses cloudflare for DDoS protection, and openresty which validates fee recipients 
for the connected validators, and reverse-proxies a consensus client. The node is running teku and geth.
Poupas generates subdomains which are kept 'secret', and distributed in DMs manually to node operators in need.

This design aims to keep most of this architecture intact, but extend some of the functionality.

### Cloudflare
Continuing to use cloudflare's DDoS protection is a no-brainer.

### Auth token generator (new component)
A node operator who wishes to use the rescue node will be required to sign a message using `rocketpool node sign-message`.
The body of this message should contain a known string and a timestamp expressed in epoch time, and the result takes the form:
```json
{
    "address": "0x1234567890123456789012345678901234567890",
    "msg": "Rescue Node 1665549215",
    "sig": "0xabcdef...6789",
    "version": "1"
}
```
The node operator would paste the message into a web ui or POST it as the body of an API request to the auth token generator.

The API will:
1. Validated the signature
1. Ensure that the timestamp is "recent"
1. Ensure that the node is not banned for misbehavior
1. Determine if a credential younger than GRACE_PERIOD_DAYS already exists, and if so, return it. If a credential between GRACE_PERIOD_DAYS and (GRACE_PERIOD_DAYS + TIMEOUT_DAYS) exists, reject access to the rescue node.
1. Ensure that the NODE_ID is eligible (is a registered rocketpool node).
1. Generate a credential of the form `urlsafe_b64encode(timestamp||hmac-sha256(rescue_node_secret, NODE_ID||timestamp))` (where `||` denotes concatenation), and store it in a persistant manner with a TTL set to TIMEOUT_DAYS + GRACE_PERIOD_DAYS.
1. Return this credential to the user pre-embedded in a URL of the form `https://NODE_ID:CREDENTIAL@rescuenode.tld`

The API should also support manual blocking of node addresses, so maintainers can proactively lock out node operators for abuse.

### Reverse proxy (existing component)
Critically, the reverse proxy should only work over https. By handling ssl termination here, we protect the privacy
of our Node Operators.

The reverse proxy currently only does a minimal fee recipient validation (and only permits the smoothing pool address).

We will want to extend it a bit.

First, we should add a periodic job that queries the upstream Execution Clients to get a list of registered rocket pool nodes and their respective validator public keys, fee recipients, and smoothing pool status.
This mapping should be cached on disk with a timestamp and updated on a regular cadence.
If all upstreams are unresponsive, we should gracefully degrade and use the cached data, and we should
not query upstreams if the cached data are fresh.

In memory, these data should be indexed by both the node address and the validator array.

When the reverse proxy receives a request, it should
  1. Validate the HMAC contents match the Authentication "user"
  1. Validate that the node is not banned for misbehavior
  1. Validate the timestamp embedded in the credential is no older than GRACE_PERIOD_DAYS
  1. If the request is to the `/eth/v1/validator/prepare_beacon_proposer` or the `.../register_validator` route,
     parse the body and ensure that the validator isn't owned by a different node, and the correct fee recipient is set (smoothing pool if opted in, otherwise the fee distributor or rEth address or smoothing pool address).
     If the validator is _not_ in the node info mapping, it must be a solo validator, and `register_validator` will have a signature proving that the owner of that validator is deliberately changing the fee recipient... `prepare_beacon_proposer` will have to cross-reference prior calls to `register_validator` before accepting a request.
  1. Parse the User-Agent header and reverse-proxy the correct beacon node.

### Beacon Node / Execution Client pairs
We need 3 pairs to cover full support. The reverse proxy can be cotenant on one with low resource requirements.
For ease of maintenance, we should just run smartnode. Eth1 client selection methodology TBD.

Once nimbus split mode is available, we can trivially extend to a 4th upstream beacon node.

## Nice-to-haves
These are soft requirements that I think are worth pursuing after the MVP is built.

### Monitoring
Ideally, we will monitor uptime/performance and set up a pager rotation among trusted volunteer maintainers. The rotation should be paid, with funding coming from the same grant.

### Frontend
A status page would be good, as well as a guide on setting up the rescue node.
There should be an info page describing who the maintainers are, to the degree that they are willing to reveal their identities, as well as which mev-boost relays are active.

### Checkpoint Sync

The rescue node should expose the endpoints required for checkpoint sync in a traditionally rate-limited fashion.

That is, you should be able to check point sync from it once per minute, or something along those lines, regardless of whether or not you are currently in your GRACE_PERIOD_DAYS interval.

### Treegen

It'd be nice if the rescue node implemented a rewards tree generation pass on a daily or continual basis, so that we can alleviate some of the busywork on Joe's plate with the daily tree previews. This can be automated, and we can push results to a public s3 bucket. They're trivially small (a few megabytes), so the additional cost is negligible.

### Non-mev-boost solo validator credential piggy-backing

This spec describes a way to securely allow solo validators who have mev-boost enabled to use the rescue node, however, it does not currently allow non-mev-boost solo validators to use it. This is due to the lack of a signature on the `prepare_beacon_proposer` endpoint, which means we can't verify custody of a given solo validator automatically. We should follow up this work to provide an endpoint which accepts messages signed with a solo validator's BLS keys and affiliates them to an existing credential, to expand utility of the rescue node to hybrid mode users who have solo validators that they do not wish to enable mev-boost on.

## Caveats

No system is perfect, and this is no exception.
1. Hybrid mode node operators are using the rescue node for their solo validators _at their own risk_. Since there is no way for us to validate the correctness of their fee recipients, it is feasible for one Node Operator to overwrite the fee recipient of a hybrid node operator. However, this would not steal tips/mev destined for the Rocket Pool protocol, so this risk is entirely owned by the node operator, and they can decide for themselves whether to accept it. However, since `/eth/v1/validator/register_validator` requires a signature, node operators who use MEV-Boost are shielded from this risk. Until we devise a way to prove custody, non-MEV-boost solo validators will not be able to use the rescue node.
1. Smoothing Pool status changes may not reflect immediately. We are polling the eth1 client to create the validator/node info mapping, and the poll interval may be on the order of epochs. To mitigate this, we will allow node operators to use the smoothing pool address as their fee recipient, even if we think they are opted out. Smartnode updates the fee recipient before the opt-in transaction is completed, so we should be flexible here.
1. Credential sharing- a node operator could feasibly generate a credential and send it to someone, skirting the "RP Node Operators Only" design goal. This would be detectable- we would see requests from validators using the credential without belonging to the node, and none from validators belonging to the node. We will mitigate this if/when it comes up.
