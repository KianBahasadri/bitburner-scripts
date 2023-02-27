# bitburner-scripts
A series of scripts for the game BitBurner
The scripts have different versions, please use the newest ones.
Also, compatibility between different versions is finnicky.
I only created a new version when I felt like I had made a "decent" number of changes to it.
the old versions are only there for archival purposes.
Below is a brief description of what each type of script does


## attack_target
This script attacks a specific target.

It is *supposed to* be RAM optimized, but I have not gotten around to doing that yet.

It has custom logs, as I didn't like how the default logs presented information.

It takes a lot of arguments, because its not meant to be ran by the user, but by a deployer script.


## deployer
This script deploys the attack_target scripts on external servers.

At the time of writing, this only deploys the attack scripts on servers adjacent to home, but I'm working on getting it to deploy to every server that I 
have root access on.

I spent a lot more time on the terminal output than I did on the functionality lol.

But what is the point of a hacker game if your terminal output doesnt look like a hackers? right?


## worm
This script is meant to gain root access.

This script is intentionally created inefficiently.

From what I gather, most players of this game created worm scripts that run only on the home server.

However, imo that super duper mega cringe. Imagine creating a MALWARE that never leaves YOUR computer!?!?!?

I think the reason a computer virus is so cool, is that it copies itself onto other computers.

I wanted this functionality in my program, which is why I made it like this, unfortunately it causes some drawbacks. But idk, at least im not cringe.
