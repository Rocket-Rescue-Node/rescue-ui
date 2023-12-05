# How To Disconnect

Disconnecting from the Rescue Node is as simple as undoing the changes you did when you originally connected.

## Rocket Pool Node Operators

If you're using the Smartnode Addon, simply uncheck the `Enabled` box in `rocketpool service config`.
Save and exit, and restart the containers when prompted.

If you connected manually, follow these steps:

Revert `~/.rocketpool/override/validator.yml` to its original state from your backup:
```
cp ~/.rocketpool/override/validator.yml.bak ~/.rocketpool/override/validator.yml
```

Save, exit, and run `rocketpool service start`.

<div class="warning">

If you didn't create a backup or it isn't disconnecting you, you can replace the file with these commands:
```
rocketpool service stop
rm ~/.rocketpool/override/validator.yml
rocketpool service install -d
rocketpool service start
```

</div>

## Solo Stakers

Docker Compose and Systemd users should review the [Connection Guide](solo.md) and restore their backed up configs to disconnect.  
Don't forget to `sudo systemctl daemon-reload` and restart, or to `docker compose up -d` to restart.

eth-docker users can use `git diff` to check which files have been modified, and `git restore` to restore them to their original states.  
If you modified your `.env` file, edit it and restore `CL_NODE=` variable to the value before you connected (default is `CL_NODE=http://consensus:5052).  
Run `./ethd update` and `./ethd up` to apply the changes.
