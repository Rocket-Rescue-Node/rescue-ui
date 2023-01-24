# rescue-ui

[![Website shields.io](https://img.shields.io/website-up-down-green-red/https/rescuenode.com.svg)](https://rescuenode.com/) 

This repository contains the source code for [Rocket Rescue Node](https://rescuenode.com), a community-run, trust-minimized, and secured fallback node for emergencies and maintenance.


## Local Development

Due to CORS policy, there's 2 options for local development:

1. In `js/main.js` change the variable `dev` to `true`. This will bypass communicating with the server and is a good solution for changes that don't require commuication with the rescue node.
1. Run your own Rescue Node locally. This requires you to run execution and consensus clients, the [rescue-proxy](https://github.com/Rocket-Rescue-Node/rescue-proxy), and the [rescue-api](https://github.com/Rocket-Rescue-Node/rescue-api).