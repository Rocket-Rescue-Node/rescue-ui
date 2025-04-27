# Risks and Trust

While we have done everything in our power to minimize risks and trust assumptions, there are a few that remain.

## Trust Assumptions
A User of Rocket Rescue Node is explicitly trusting that its Maintainers will not attempt to steal their proposal rewards and is accepting full liability.
We obviously have no intention of doing so, however, it is theoretically within our ability to siphon proposal fees.
For a list of the current Maintainers, see the [About](./about.md) section.
We have gone to great lengths to prevent a User of Rocket Rescue Node from stealing the proposal fees from another User, but we cannot promise that it is impossible to do so.
You are explicitly trusting that the safeguards we put in place are sufficient.

Rocket Rescue Node is fully non-custodial.
Your validator keys remain local to your node.

## Risks
The slashing risks of Node Operation are not mitigated by Rocket Rescue Node.
We encourage you to use Doppelgänger Detection, and always wait the prescribed 15 minutes after changing Validator Clients.
Since your keys remain in your custody and your Validator Client's slashing protection database remains in place, Rocket Rescue Node does not present additional slashing risks, outside of the usual human error.
Please exercise caution whenever performing administrative functions on your node.

### Fee Recipient Enforcement
For locally built blocks, The Rocket Rescue Node forces connected users to use fee recipients that are known to be safe.  

For Rocket Pool Node Operators, this means either their node's fee distributor contract, or the smoothing pool contract, depending on whether they are in the smoothing pool.  
For solo stakers, **we only accept the withdrawal address as the fee recipient for locally built blocks.**  

For blind blocks, any fee recipient is accepted.  

<div class="warning">

We ***strongly*** **recommend solo stakers use their withdrawal address as their fee recipient, or at least enable MEV-Boost before connecting.**

Invalid fee recipients can lead to missed proposals.

</div>

## Data Retention
As a matter of necessity, your wallet address and IP address are logged by our system.
This allows us to proactively block Users who attempt to misbehave.
We will never share these data with a third party.
If you would like to have an extra layer of anonymity, we recommend using a VPN on your node to anonymize your IP address.

## Types of Theft
Proposals include two types of Execution Layer rewards, tips, and if enabled, MEV.
They also include a reward on the Consensus Layer, which is not at risk.

## Stealing tips
The main type of theft that is possible is the theft of tips by the maintainers of the service.
Since anyone with access to the Beacon API can call `prepare_beacon_proposer`, a malicious maintainer could overwrite your fee recipient and steal the tips for any locally built blocks you publish while connected.

## Stealing MEV
Stealing MEV is not possible, to the best of our knowledge.
The `register_validator` request from the validator client requires a signature from the validator's keys, and we have no way of spoofing it.
However, a malicious maintainer could force your validator to use locally built blocks only, and proceed to steal the tips, as described above.
