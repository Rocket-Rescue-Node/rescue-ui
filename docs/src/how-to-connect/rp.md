# How To Connect As a Rocket Pool Node Operator

After following the steps from the [previous section](SUMMARY.md), the website will present you with the easiest way to connect.

As of Smartnode v1.11.1, this is to use the Rescue Node Addon in the Addons section of `rocketpool service config`.

Enable the addon and paste your username and password from the website.
Press `<enter>` after pasting, or your changes won't be saved.

Save and exit.
Restart the mentioned containers when prompted.

You can check you completed the process by running `rocketpool node status`. At the bottom of the output you should see a message like this:

![Node Status Output](./nodestatus.png)

---

## Manually Connecting (without the Addon)

If you haven't upgraded to v1.11.1 yet, or want to connect the old way, follow these steps.

First, back up your `~/.rocketpool/override/validator.yml` file using this command:
```
cp ~/.rocketpool/override/validator.yml ~/.rocketpool/override/validator.yml.bak
```

Modify your `~/.rocketpool/override/validator.yml` file using a text editor, e.g. `nano`:
```
nano ~/.rocketpool/override/validator.yml
```

<div class="warning">

This file is whitespace sensitive!

You must use **spaces** instead of tabs, and the alignment must match the example.

</div>

Edit the file to look **exactly** as this example does, but with your credentials instead of `USERNAME` / `PASSWORD`, and with your client name instead of `CLIENT` (e.g. `teku` for `CLIENT` if you are using teku).

## Examples

### Example for Most Clients
<div class="warning">

This example is for:

 - lighthouse
 - lodestar
 - nimbus
 - teku

Prysm users should go to [the following example](#example-for-prysm).

</div>

```yaml
# Enter your own customizations for the validator container here. These changes will persist after upgrades, so you only need to do them once.
# 
# See https://docs.docker.com/compose/extends/#adding-and-overriding-configuration
# for more information on overriding specific parameters of docker-compose files.

version: "3.7"
services:
  validator:
    x-rp-comment: Add your customizations below this line
    environment:
      - "CC_API_ENDPOINT=https://USERNAME:PASSWORD@CLIENT.rescuenode.com"
```

### Example for Prysm

```yaml
# Enter your own customizations for the validator container here. These changes will persist after upgrades, so you only need to do them once.
# 
# See https://docs.docker.com/compose/extends/#adding-and-overriding-configuration
# for more information on overriding specific parameters of docker-compose files.

version: "3.7"
services:
  validator:
    x-rp-comment: Add your customizations below this line
    environment:
      - "CC_RPC_ENDPOINT=prysm-grpc.rescuenode.com:443"
      - "VC_ADDITIONAL_FLAGS=--grpc-headers=rprnauth=USERNAME:PASSWORD --tls-cert=/etc/ssl/certs/ca-certificates.crt"
```

## Applying the Changes

After modifying the file, save and exit.

Run `rocketpool service start` to apply the changes.

You can monitor the validator for errors using `rocketpool service logs validator`.
See the [FAQ](../faq.md) for more details on how to verify the changes were effective.

<div class="warning">

Once connected, **do not forget** to [disconnect](disconnect.md) before 15 days, or to request a new credential on the 14th day. 

Failure to do so will result in **missed attestations and other duties**.

</div>

---

## Advanced Usage

<div class="warning">

Most users should not integrate this way.

These steps are not required if you followed the above guide.

</div>

The Rescue Node can also function as a fallback for all clients.
Users who want to be able to submit transactions (i.e., to claim rewards or launch minipools) while their primary EC is syncing or undergoing maintenance can use this method.


Rescue Node only provides a Consensus Client API- not an Execution Client API.
Thus, in order to use it as a fallback, you must bring your own alternative Execution Layer API, such as an [Infura Web3 URL](https://infura.io).

To set this up, run `rocketpool service config` and go to `Fallback Clients`.
Check `Use Fallback Clients`.

1. Insert the `Execution Client URL` (e.g, the Infura Web3 URL).
1. In the `Beacon Node (HTTP) URL` box, insert `https://USERNAME:PASSWORD@CLIENT.rescuenode.com`, substituting USERNAME/PASSWORD/CLIENT.
1. **If using Prysm** follow these additional steps:
    - In the `Beacon Node JSON-RPC URL` box insert `prysm-grpc.rescuenode.com:443`
    - Go back to the main config and edit your `Consensus Client Settings`->`Additional Validator Client Flags` to contain `--grpc-headers=rprnauth=USERNAME:PASSWORD --tls-cert=/etc/ssl/certs/ca-certificates.crt`, substituting your USERNAME/PASSWORD. 

As usual, changes are effective after running `rocketpool service start`.
