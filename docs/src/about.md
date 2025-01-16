# About the Rocket Rescue Node

At its core, Rocket Rescue Node is a community-operated Ethereum node which can be used by node operators as an emergency fallback node during maintenance.

Rocket Rescue Node was first created to help [Rocket Pool](https://rocketpool.net/) Node Operators survive The Merge in September '22, but quickly proved its lasting utility.
In December 2023, we launched solo validator support.


We have [received a pDAO grant](https://dao.rocketpool.net/t/january-2023-gmc-call-for-grant-applications-deadline-is-january-15th/1335/3) to help ensure its ongoing available to the community.

Under the hood, Rocket Rescue Node is actually five nodes to maximize Beacon Client compatibility, a custom reverse-proxy to combat potential malfeasance by its users, and an API and UI to make it easy to access.
For more information, see the [Tech Specs](./tech-specs/SUMMARY.md).

## Limits
Currently, a single Rocket Pool node is restricted to using Rocket Rescue Node **four times per year, for 15 days at a time**.
Solo stakers are restricted to using the Rocket Rescue Node **thrice per year, for 10 days at a time**.
Re-requesting access before the window ends will **not** consume additional quota nor will it extend your access, **unless less than 2 days remain**.
Therefore, if you lose your access URL, you can rerequest access to retrieve it, up to 8 or 13 days after it was created.

## Maintainers
The rescue node is currently maintained by:

- João Poupino
  - **@poupas** on Discord
  - [GitHub](https://github.com/poupas)
  - [RP Dao Forum](https://dao.rocketpool.net/u/poupas/summary)
  - [Twitter](https://twitter.com/poupas)
- Jacob Shufro
  - **@Patches** on Discord
  - [GitHub](https://github.com/jshufro)
  - [RP Dao Forum](https://dao.rocketpool.net/u/patches/summary)
  - [Twitter](https://twitter.com/0xPatches)
- Ken Smith
  - **@Ken** on Discord
  - [GitHub](https://github.com/htimsk)
  - [RP Dao Forum](https://dao.rocketpool.net/u/ken/summary)
  - [Twitter](https://twitter.com/nextblock_eth)
- Thorsten Behrens
  - **@yorickdowne** on Discord
  - [GitHub](https://github.com/yorickdowne)
  - [RP Dao Forum](https://dao.rocketpool.net/u/yorickdowne/summary)
  - [Twitter](https://twitter.com/yorickdowne)

## Credits
  - @poupas - prototype, rescue-api, design, infrastructure, security
  - @Patches - rescue-proxy, credentials library, design, general administrative stuff
  - @hanniabu.eth - original rescue-ui website
  - @dmccartney - new rescue-ui website with solo support
  - @sleety.eth - logo design

## Open Source
The software that secures and powers Rocket Rescue Node is open source under the AGPL V3 License.

[View source code on GitHub](https://github.com/orgs/Rocket-Rescue-Node/repositories)
