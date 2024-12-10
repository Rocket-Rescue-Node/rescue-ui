# FAQ
<details>
  <summary>When should I use the Rescue Node?</summary>

The Rescue Node is for when your Consensus or Execution layer clients need troubleshooting or maintenance and those processes have to be stopped. The Rescue Node needs to connect to your Validator client in order to function. So you should use the Rescue Node, for example, when syncing the chain, troubleshooting an execution client problem, or switching clients. You _should not_ use the Rescue Node when your entire machine is not functional or offline.


</details>

<details>
  <summary>How often can I use the Rescue Node?</summary>

Rocket Pool Node operators can use it four times per year.  
Solo stakers can use it thrice per year.


Each token is valid for ten or fifteen days, respectively, for solo stakers and Rocket Pool node operators.
If you lose your token, you can simply repeat the request process to retrieve it.
This will not count against your usage limits unless less than 48 hours remain, in which case a new token valid for 10/15 additional days will be issued.


</details>

<details>
  <summary>Why can't I claim rewards or do other operations while using the Rescue Node?</summary>

The Rescue Node only ensures that attestations, proposals, sync committees and other duties are performed- in order to join or leave the smoothing pool, claim rewards, or submit other transactions, you either must have synced local clients, or use infura as a fallback.
Your Rescue Node URL, from `~/.rocketpool/override/validator.yml` will work as a Consensus Client fallback URL in conjunction with an Infura web3 URL configured as an Execution Fallback, if you need to submit a transaction in a pinch.

</details>

<details>
  <summary>How can I check that I successfully connected to the Rescue Node?</summary>

As of Smartnode v1.11.1, `rocketpool node status` will contain a message telling you that you are using the Rescue Node, and how much longer you have access.

Addtionally, most validator clients will log a message containing the url.
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
  <summary>Why do I have to submit a signed message to connect?</summary>

The signed message allows us to enforce our quotas.
We don't save it, or broadcast it, or use it for any other purpose.

</details>

<details>
  <summary>How can I check when my credential expires?</summary>

Rocket Pool users who connected with the Smartnode Addon can run `rocketpool node status` to see when their current username/password will expire.  
All other users can go to this [CyberChef](https://gchq.github.io/CyberChef/#recipe=Comment\('INSTRUCTIONS:%5Cn%5CnPaste%20your%20username/password%20separated%20by%20a%20single%20%60:%60%20in%20the%20input%20box.'\)To_Hex\('None',0\)Find_/_Replace\(%7B'option':'Regex','string':'0a$'%7D,'',false,false,false,false\)From_Hex\('Auto'\)Split\(':','%5C%5Cn'\)Fork\('%5C%5Cn','%5C%5Cn',false\)From_Base64\('A-Za-z0-9-_',true,false\)To_Hex\('None',0\)Merge\(true\)Comment\('Store%20hex%20node%20id%20in%20R0'\)Register\('\(%5B%5C%5Cs%5C%5CS%5D*\)%5C%5Cn',true,false,false\)Find_/_Replace\(%7B'option':'Regex','string':'.*%5C%5Cn'%7D,'',true,false,true,false\)From_Hex\('Auto'\)Comment\('Store%20Password%20binary%20in%20R1'\)Register\('\(.*\)',true,false,true\)Comment\('Parse%20Issued%20Date%20into%20R2'\)Protobuf_Decode\('',false,false\)JPath_expression\('$.1.2','%5C%5Cn',true\)Register\('\(%5B%5C%5Cs%5C%5CS%5D*\)',true,false,false\)Comment\('Humanize%20Issued%20Date%20into%20R3'\)From_UNIX_Timestamp\('Seconds%20\(s\)'\)Register\('\(%5B%5C%5Cs%5C%5CS%5D*\)',true,false,false\)Comment\('Store%20Operator%20Type%20in%20R4'\)Find_/_Replace\(%7B'option':'Regex','string':'.*'%7D,'$R1',false,true,true,true\)Protobuf_Decode\('',false,false\)JPath_expression\('$.1.3','%5C%5Cn',true\)Find_/_Replace\(%7B'option':'Regex','string':'%5E$'%7D,'0',true,false,true,false\)Register\('\(%5B%5C%5Cs%5C%5CS%5D*\)',true,false,false\)Find_/_Replace\(%7B'option':'Simple%20string','string':'0'%7D,'Rocket%20Pool',true,false,true,false\)Find_/_Replace\(%7B'option':'Regex','string':'1'%7D,'Solo',true,false,true,false\)Register\('\(%5B%5C%5Cs%5C%5CS%5D*\)',true,false,false\)Comment\('Calculate%20Expiry%20Timestamp,%20store%20in%20R5'\)Find_/_Replace\(%7B'option':'Regex','string':'.*'%7D,'$R4%20-5',false,true,true,true\)Multiply\('Space'\)Find_/_Replace\(%7B'option':'Regex','string':'$'%7D,'%2015',true,true,true,true\)Sum\('Space'\)Find_/_Replace\(%7B'option':'Regex','string':'$'%7D,'%2024%2060%2060',true,true,true,true\)Multiply\('Space'\)Find_/_Replace\(%7B'option':'Regex','string':'$'%7D,'%20$R2',true,true,true,true\)Sum\('Space'\)Register\('\(%5B%5C%5Cs%5C%5CS%5D*\)',true,false,false\)From_UNIX_Timestamp\('Seconds%20\(s\)'\)Register\('\(%5B%5C%5Cs%5C%5CS%5D*\)',true,false,false\)Find_/_Replace\(%7B'option':'Regex','string':'.*'%7D,'Credential:%5C%5Cn%5C%5CtIssued%20to%200x$R0%5C%5Cn%5C%5CtIssued%20on%20$R3%5C%5Cn%5C%5CtExpires%20on%20$R7%5C%5Cn%5C%5Ct$R5%20Node%20Operator',false,true,true,true\)&input=OVVrYUxjS19BUVVWem5vUU1jb2ZYQ0hRa1pVPTpDZ2dReG96T3F3WVlBUklnR21GX2lBUThfaXg4Z1VnZmpDNjVwSG5acFN2XzJWLVd0cFhzSDFna2hDST0) page and follow the instructions at the top of the recipe to check their username:password.

</details>
