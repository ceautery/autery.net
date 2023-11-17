# From Baudot to Graphemes

## Part 1. The age of dial-up modems

> It [transmitting data with a modem] is a simple principle, and telecommunicating would be easy if all computers spoke precisely the same digital language. They don't, however, and that's where telecommunicating can become frustrating. - ASCII Express instruction manual

In 1985, I attended a small magnet high school called the Linworth Alternative Program. In one of the rooms used primarily for math classes, there was a dumb terminal, a rotary phone, and a 300 baud [accoustic coupler modem](https://en.wikipedia.org/wiki/Acoustic_coupler). On a piece of paper taped nearby was a list of phone numbers of local Columbus BBS servers - COMPUTE, The Tesseract, The Village (after the 1960s British TV show "The Prisoner"), others I've forgotten in the intervening 38 years.

.tip
![](/images/Acoustic_modem_and_phone_plugged.jpg)
[Acoustic modem and phone plugged](https://upload.wikimedia.org/wikipedia/commons/a/a8/Acoustic_modem_and_phone_plugged.jpg)
by [Olivier Berger](https://commons.wikimedia.org/wiki/User:OlivierBerger)
is licensed under [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/deed.en)

You could dial one of these numbers, a modem would answer with a carrier signal, and you then placed the phone handset on top of the modem. After a second, the modems understood what was what, and their attached terminals could start exchanging data. In this case, the BBS would send you an info screen and login prompt, sometimes including ASCII art like so:

```
NetBSD 7.0.2 (PANIX-VC) #5: Fri May 12 12:13:35 EDT 2017

Welcome to NetBSD!

(1.101y 01-Jun-11 wtf 11pm pub) + MonoLib(1.23i 27-Aug-07). NetBSD-x86_64-7.0.

Current Users on Monochrome : 1.

[][]      [][]
[][][]  [][][]
[][][][][][][]
[][]  []  [][]  [][]   [][]   [][]   [][] []  []  [][]   [][]   [][][]  [][][]
[][]      [][] []  [] []  [] []  [] []    []  [] []  [] []  [] [] [] [] []
[][]      [][] []  [] []  [] []  [] []    [][][] [][][] []  [] []    [] [][]
[][]      [][] []  [] []  [] []  [] []    []  [] [] []  []  [] []    [] []
[][]      [][]  [][]  []  []  [][]   [][] []  [] []  []  [][]  []    [] [][][]

|We explicitly disclaim everything we may under English law. Specifically, but|
| not limited to the fact that any statement made by a user on this system is |
| not necessarily the view of, nor supported by the operators of this system. |


If you do not have a Monochrome account, enter 'guest'
Account :
```
(Source: mono.org telnet server)

Except it wouldn't quite have looked like that. Most of us had terminals that were only 40 characters wide, and most home computer keyboards back then only supported upper-case characters, thanks to [Woz not already being rich](https://www.vintagecomputing.com/index.php/archives/2833/why-the-apple-ii-didnt-support-lowercase-letters), and the lack of mass-market ASCII peripherals in 1974.

These "boards" were an awakening for me. They were social networks of nearby young computer enthusiasts who could suddenly communicate with people like them. This was back in a time when being a nerd was much less mainstream, and bullying wasn't exactly frowned on. For many of us who were some degree of an outlier in our normal lives, after our first public BBS post gets replies from our contemporaries, we realize we're normal and part of a larger community.

It was beautiful. And years before any of us would discover the internet. I liked connecting to boards ("getting online" wasn't in the vernacular back then) so much that I needled my parents to buy a modem for my Apple //c. I'm pretty sure I still rode my bike places, climbed trees, played soccer, what have you, but if I was home I was on the computer typing furiously on one BBS or other.

My modem, an Avatex 1200, was more complicated than an accoustic coupler modem. You changed it's settings by typing to it from a terminal program on your computer, which would transmit command signals to it over a serial cable. The modem would start listening for commands when you typed "AT" (attention).

.tip
![](/images/avatex_1200.jpg)
[Commodore insitu loz](https://commons.wikimedia.org/wiki/File:Commodore_insitu_loz.jpg)
by [Alex Lozupone](https://commons.wikimedia.org/wiki/User:Tduk)
is licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.en)

After that you could use "init string" commands to set properties for the connection like timeouts and how flow control (notifying a device to stop sending so you can catch up, and then telling it when you're ready again) will work on the next connection. Dialing the phone was the D command, and back then some phone lines didn't have touchtone service yet, so you said whether to dial in pulse or tone mode with P or T. A typical command sequence would be:

```
ATS30=12&K4
ATDT5551212
```

The first line is the init string. This particular one sets S-register 30 to 12, which for a Hayes modem would set the inactivity timeout to 120 seconds, and &K4 sets [Xon/Xoff flow control](https://en.wikipedia.org/wiki/Software_flow_control), where the control-S and control-Q characters are transmitted from modem to modem if either side needs time to process buffered data. The second line tells the modem to dial using touchtone to 555-1212 (we didn't need to include an area code on local numbers back then). Once connected to the remote modem, you were switched to online mode, and your keystrokes were transmitted to the other modem. Once you were done, `+++` returned you to command mode (usually, there was an S-register to set what the escape character was, which defaulted to +), and `ATH0` would hang up, where `ATO` would return you to online mode.

As modems got faster, there were more chances for errors in transmission (the phone network could have static, signal bleed, impedence problems, etc.), and for buffering problems as the speeds of UARTS, CPUs, and modem connections were all getting faster at different rates. Naturally, data-link layer protocols needed to evolve to keep up. Between my discovery of the BBS scene in the 80s and getting hired into a tech support job at CompuServe in 1995, several sophisticated protocols like LAPB, LAPM, MNP, and BTLZ were developed, and newer modems supported more and more of those. If both modems connected in error control mode, the [modems would negotiate](http://www.messagestick.net/modem/Hayes_Ch1-1.html#cmd_&Q) the best protocol they both supported.

In my tech support role, I memorized a large number of init string commands for all the major chipsets (Rockwell, USRobotics, and Motorola were the main ones I ran into, with an occasional Global Village for the fancy Mac users) to set various modes like locking the baud rate lower, turning on error control (or "buffered async" for the less expensive winmodems that didn't have an error correction chip). That bag of tricks was enough to solve 95% of the connection problems my customers called in about.

CompuServe's client software had a list of modems for users to select, which would pre-populate an init string. Unfortunately, they all turned on [RTS/CTS flow control](https://stackoverflow.com/questions/957337/what-is-the-difference-between-dtr-dsr-and-rts-cts-flow-control), where most users would have had a better experience with Xon/Xoff. RTS/CTS only works between a modem and the computer it's connected to, and inevitably users with underpowered computers would run out of buffer because they couldn't process data fast enough, and then either the user would lose data if they weren't in error control mode, or get disconnected after too many error-controlled packets have to be sent again. In Xon/Xoff, a struggling computer could send an Xoff character over the modem to the CompuServe side, and the server would know to stop sending, and why, and the connection would stay healthy.

During my time there, 50% of my customer interactions were solved by swapping a K3 for a K4 in an init string. All of tech support knew about the problem, but none of us had a communication path to the devs who wrote our client software. We could have laid off half of our tech support guys just by updating our client software's default settings. Not that I'm complaining; the volume of calls was most of the reason they hired me off the street despite having never worked a desk job before.

I started thinking about this world again recently, in particular about a misunderstanding I had about the whole flow control problem. I thought that RTS/CTS was between the two modems somehow, and that data was lost because the CompuServe server was also behind an X.25 node that talked to the modem banks in the [PoP](https://en.wikipedia.org/wiki/Point_of_presence), which couldn't see the "signal" from the modem.

And so I decided to read up on the topic, and make sure I had my facts straight. I started with a simple question: If dial-up modems are set in "hardware flow control" mode, using RTS/CTS or DTR/DSR signals between each modem and its terminal, is there any mechanism to tell the remote modem to stop sending?

I found an answer eventually: No. The receiving modem just has to buffer, and if that overflows the connection has to rely on some external error check, MNP on the connection itself, or a higher level transfer protocol like Z-modem. I did find this reference in the ITU's [V.43 data flow control recommendation](https://www.itu.int/rec/T-REC-V.43-199802-I/en), in section 4.2, "Methods for flow control of received data":

> NOTE – The data whose flow is temporarily stopped or slowed down is originated from the remote DTE. In order to control the flow of that data so that no data is lost, the local DCE will either need to provide a received data buffer whose size cannot be specified in this Recommendation, or a mechanism will need to be implemented in the system to force the remote DTE to stop transmitting data until such time as the DTE not-ready condition is cleared.

So at least someone was thinking about it. Why should the official recommendation for flow control not take a harder stance on this? I think it's because of the natural push and pull between standards writers and hardware manufacturers. Some of what the ITU does is document what has already been created, and this flow control edge case is a clear example of that.

The ITU isn't completely toothless, though. Their [V.90 recommendation](https://www.itu.int/rec/T-REC-V.90-199809-I/en) for 56k modem connections was an official call to action for both USRobotics and Rockwell, who created [incompatible 56k standards](https://www.inetdaemon.com/tutorials/computers/hardware/modems/v90.shtml), X2 and K56Flex, forcing consumers to pick a side or suffer slower connection speeds. Fortunately both companies were quick to adopt the common standard, since modems had also started using EPROMs that could be flashed to support more features. Shortly after that "protocol war", cable internet and DSL came on the scene, making dial-up standards less relevant as consumers tossed their modems into garage sale bins.

Along the way to find the answer to my question, I fell down the rabbit hole of the history of telecommunications. Much of that history took place in 19th century France, and some of it dates all the way back to the French Revolution.

## Part 2. In the aftermath of revolution

> Paris is quiet and the good citizens are content - Napolean
