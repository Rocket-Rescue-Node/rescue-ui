# FAQ

<details>
  <summary>How often can I use the Rescue Node?</summary>

Four times per year.

Each token is valid for fifteen days.
If you lose your token, you can simply repeat the request process to retrieve it.
This will not count against your usage limits unless less than 48 hours remain, in which case a new token valid for 15 additional days will be issued.


</details>

<details>
  <summary>Why can't I claim rewards or do other operations while using the Rescue Node?</summary>

The Rescue Node only ensures that attestations, proposals, sync committees and other duties are performed- in order to join or leave the smoothing pool, claim rewards, or submit other transactions, you either must have synced local clients, or use infura as a fallback.
Your Rescue Node URL, from `~/.rocketpool/override/validator.yml` will work as a Consensus Client fallback URL in conjunction with an Infura web3 URL configured as an Execution Fallback, if you need to submit a transaction in a pinch.

</details>

<details>
  <summary>How can I check that I successfully connected to the Rescue Node?</summary>

Most validator clients will log a message containing the url.
You can see if it connected by running:
```
docker logs rocketpool_validator |& grep rescuenode.com
```

If that doesn't work, you can also check the following command to make sure the validator is using the Rescue Node URL:
```
docker exec rocketpool_validator env |& grep rescuenode.com
```

Follow your validators on [beaconcha.in](https://beaconcha.in/) to verify that they are attesting.

</details>

<details>
  <summary>How can I disconnect from the Rescue Node?</summary>

Edit your `~/.rocketpool/override/validator.yml` file again, and remove all the lines you added when you connected- normally everything after the `x-rp-comment` line.
Next, run `rocketpool service start`.

If you're having trouble, the following commands will also reset the file:
```
rm ~/.rocketpool/override/validator.yml; rocketpool service install -d; rocketpool service start
```

</details>
