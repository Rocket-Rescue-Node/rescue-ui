# How To Connect As a Solo Staker

<div class="warning">

Solo Stakers can only use the Rescue Node if running their validators in a stand-alone process.

If you have loaded your keys into the Beacon Node directly, there is no way to connect.

For eth-docker users, this means only Prysm, Lodestar, and Lighthouse are supported as of Nov. 2023.

</div>

<div class="warning">

We recommend having migrated all active validators to 0x01 and **using the 0x01 address as the fee recipient.**
If MEV-Boost is not enabled by your Validator Client, you will miss proposals on all validators if any noncompliant fee recipient is used.
Additionally, even if MEV-Boost is enabled and there is no MEV available for a proposal duty assignment, that proposal will be missed unless all fee recipients are compliant. 

If this is an emergency and you don't have time to migrate to 0x01, **we strongly recommend enabling MEV Boost / External Builders in your Validator Client flags to minimize potential losses.**

</div>

# Getting Started

**First**, follow the steps from [previous section](SUMMARY.md) to receive a credential (a USERNAME / PASSWORD pair).

Connecting as a Solo Staker depends on how you originally installed your Validator Client.

- Most solo staking guides instruct the user to install it natively with a systemd service file.
- Some solo stakers may have opted to use [eth-docker](https://eth-docker.net/) instead.
- Others may use docker-compose directly.

No matter how you originally installed your Validator Client, to proceed you will need the credential pair you received after submitting your signed message on the [website](https://rescuenode.com).

# Constructing your access URL(s)

---

For **ALL** users, the URL will have the format:
```
https://USERNAME:PASSWORD@CLIENT.rescuenode.com
```

where CLIENT is `nimbus`, e.g., for Nimbus, and USERNAME/PASSWORD are your credentials from the website.

---

If you use **Prysm**, you have an additional authorization header.
```
USERNAME:PASSWORD
```

---

## Native Installation (with systemd) or Docker installation with Docker Compose

<div class="warning">

Make a backup copy of your systemd service file for your validator client, or the docker-compose.yml file.

You will need this to disconnect from the Rescue Node when your access expires.

</div>

Modify your systemd service file for your validator client, or your docker-compose.yml file where the validator client service is defined.

Add or change your Beacon Node URL flag according to which client you use (substituting for YOUR_ACCESS_URL and if using Prysm, YOUR_AUTH_HEADER):

---

- Lighthouse:
```
--beacon-nodes YOUR_ACCESS_URL 
```

- Lodestar:
```
--beaconNodes YOUR_ACCESS_URL
```

- Nimbus:
```
--beacon-node=YOUR_ACCESS_URL
```

- Prysm:
```
--beacon-rest-api-provider=YOUR_ACCESS_URL \
--beacon-rpc-provider=prysm-grpc.rescuenode.com:443 \
--grpc-headers=rprnauth=YOUR_AUTH_HEADER \
--tls-cert=/etc/ssl/certs/ca-certificates.crt
```

- Teku:
```
--beacon-node-api-endpoint=YOUR_ACCESS_URL
```

---

If modifying a systemd unit file, save it and run `sudo systemctl daemon-reload` before restarting the service.  
If modifying a docker-compose file, save it and run `docker compose up -d`.

## eth-docker Users

<div class="warning">
Only Prysm, Lodestar, and Lighthouse are supported as of Nov. 2023.
</div>

---
Lighthouse and Lodestar:
- Edit `.env` with a text editor of your choice and update `CL_NODE=` to `CL_NODE=YOUR_ACCESS_URL`

Prysm
- Edit `prysm.yml` or `prysm-vc-only.yml` depending on whether eth-docker runs your Consensus Client or not.
- In the `validator` service `entrypoint` list, update or add the folling flags:

```
- --beacon-rpc-provider
- prysm-grpc.rescuenode.com:443
- --beacon-rpc-gateway-provider
- prysm-grpc.rescuenode.com:443
- --grpc-headers
- rprnauth=YOUR_AUTH_HEADER
- --tls-cert
- /etc/ssl/certs/ca-certificates.crt
```
---

Run `./ethd update` to rebuild your containers.
Run `./ethd up` to finish connecting.
Monitor `./ethd logs validator` for errors.

# Finishing Up

<div class="warning">

Once connected, **do not forget** to [disconnect](disconnect.md) before 10 days, or to request a new credential on the 9th day. 

Failure to do so will result in **missed attestations and other duties**.

</div>
