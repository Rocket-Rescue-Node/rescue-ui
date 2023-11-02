# Risks and Trust

While we have done everything in our power to minimize risks and trust assumptions, there are a few that remain.

## Trust Assumptions
A User of Rocket Rescue Node is explicitly trusting that its Maintainers will not attempt to steal their tips/MEV rewards and is accepting full liability.
We obviously have no intention of doing so, however, it is theoretically within our ability.
For a list of the current Maintainers, see the [About](./about.md) section.
We have gone to great lengths to prevent a User of Rocket Rescue Node from stealing the tips/MEV from another User, but we cannot promise that it is impossible to do so.
You are explicitly trusting that the safeguards we put in place are sufficient.

Rocket Rescue Node is fully non-custodial.
Your validator keys remain local to your node.

## Risks
The slashing risks of Node Operation are not mitigated by Rocket Rescue Node.
We encourage you to use Doppelgänger Detection, and always wait the prescribed 15 minutes after changing Validator Clients.
Since your keys remain in your custody and your Validator Client's slashing protection database remains in place, Rocket Rescue Node does not present additional slashing risks, outside of the usual human error.
Please exercise caution whenever performing administrative functions on your node.

## Data Retention
As a matter of necessity, your node address and IP address are logged by our system.
This allows us to proactively block Users who attempt to misbehave.
We will never share these data with a third party.
If you would like to have an extra layer of anonymity, we recommend using a VPN on your node to anonymize your IP address.
