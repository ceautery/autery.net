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

It was beautiful. And years before any of us would discover the internet. I liked connecting to boards ("getting online" wasn't in the vernacular yet) so much that I needled my parents to buy a modem for my Apple //c. I'm pretty sure I still rode my bike places, climbed trees, played soccer, what have you, but if I was home I was on the computer typing furiously on one BBS or other.

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

The first line is the init string. This particular one sets the inactivity timeout to 120 seconds and [Xon/Xoff flow control](https://en.wikipedia.org/wiki/Software_flow_control), where the control-S and control-Q characters are transmitted from modem to modem if either side needs time to process buffered data. The second line tells the modem to dial using touchtone to 555-1212 (we didn't need to include an area code on local numbers back then).

As modems got faster, there were more chances for errors in transmission (the phone network could have static, signal bleed, impedence problems, etc.), and for buffering problems as the speeds of UARTS, CPUs, and modem connections were all getting faster at different rates. Naturally, modem protocols needed to evolve to keep up. Between my discovery of the BBS scene in the 80s and getting hired into a tech support job at CompuServe in 1995, several protocols like LAPB, LAPM, MNP, and BTLZ were developed, and newer modems implemented them in hardware.

This meant that for backwards compatibility, modems got progressively more expensive to manufacture. The idea of passing some of the work off to the computer a modem was attached to became more attractive in the late 90s, when modem speeds were 33,600 baud and CPU speeds crossed the 300MHZ. A few different [softmodems](https://en.wikipedia.org/wiki/Softmodem) hit the PC consumer market then, and it was nothing short of a train wreck for us tech support folks. The average computer user wasn't very sophisticated back then, so talking them through installing a software driver for their modem was a chore, and often the computer wasn't up to the task and swapping error correction mode for something like "buffered async" mode was needed to keep a healthy connection.

Another common problem I ran into back then was with a modem's default flow control mode. CompuServe's client software had a list of modems for users to select, which would pre-populate an init string. All of these enabled [RTS/CTS flow control](https://stackoverflow.com/questions/957337/what-is-the-difference-between-dtr-dsr-and-rts-cts-flow-control), where most users would have had a better experience with Xon/Xoff. RTS/CTS only works between a modem and the computer it's connected to, and inevitably users with underpowered computers would run out of buffer because they couldn't process data fast enough, and then either the user would lose data if they weren't in error control mode, or get disconnected after too many error-controlled packets have to be sent again. In Xon/Xoff, a struggling computer could send an Xoff character over the modem to the CompuServe side, and this helped prevent buffer overruns and disconnects from exceeding an error limit.

I started thinking about this world again recently, in particular about a misunderstanding I had about the whole flow control problem. I thought that RTS/CTS was between the two modems somehow, and that data was lost because the CompuServe server was also behind an X.25 node that talked to the modem banks, which couldn't see the "signal" from the modem.

I decided to read up on the topic, starting by finding an answer to a simple question: If dial-up modems are set in "hardware flow control" mode, using RTS/CTS or DTR/DSR signals between each modem and its terminal, is there any mechanism to tell the remote modem to stop sending?

I found an answer eventually: No. The receiving modem just has to buffer, and if that overflows the connection has to rely on some external error check, MNP on the connection itself, or a higher level transfer protocol like Z-modem. I did find this reference in the ITU's [V.43 data flow control recommendation](https://www.itu.int/rec/T-REC-V.43-199802-I/en), in section 4.2, "Methods for flow control of received data":

> NOTE – The data whose flow is temporarily stopped or slowed down is originated from the remote DTE. In order to control the flow of that data so that no data is lost, the local DCE will either need to provide a received data buffer whose size cannot be specified in this Recommendation, or a mechanism will need to be implemented in the system to force the remote DTE to stop transmitting data until such time as the DTE not-ready condition is cleared.

So at least someone was thinking about it. Why should the official recommendation for flow control not take a harder stance on this? I think it's because of the natural push and pull between standards writers and hardware manufacturers. Some of what the ITU does is document what has already been created, and this flow control edge case is a clear example of that.

The ITU isn't completely toothless, though. Their 1998 [V.90 recommendation](https://www.itu.int/rec/T-REC-V.90-199809-I/en) for 56k modem connections was an official call to action for both USRobotics and Rockwell, who created [incompatible 56k standards](https://www.inetdaemon.com/tutorials/computers/hardware/modems/v90.shtml), X2 and K56Flex, forcing consumers and online services/ISPs to pick a side or suffer slower connection speeds. Fortunately both companies were quick to adopt the common standard, since modems had also started using EPROMs that could be flashed to support more features.

I won't talk much here about V.90 modems, but it's an interesting topic. Digital lines had been added to the public phone network going back as far as the 1960s, not all the way to customer phones on the "local loop", but between "trunks" of the phone network. In 1988, The ITU rolled out recommendation [G.711](https://www.itu.int/rec/T-REC-G.711/), a codec for encoding voice data, turning speech into a .wav file, essentially. Some ISPs had digital lines all the way to their modem banks, and could use digital modems. V.90 allows a connection where receiving (from the customer's point of view) data can happen in G.711, and transmission happens in V.34.

In 2000 the standard was enhanced with V.92, the basic change being an attempt to negotiate G.711 on both transmit and receive happened, with both falling back to V.34. I don't know enough about the technology (yet) to talk intelligentally about where the conversion to audio happens, or whether V.92 required digital local loop lines as well.

Either way, this turned out to not be very relevant, as consumers started getting true digital piped to their homes with DSL and cable internet, where 56k would seem slow in comparison. Internet users in big cities where this was first rolled out were quick to migrate, and dial-up modems started showing up in thrift stores and garage sales.

## Part 2. In the aftermath of revolution

> Paris is quiet and the good citizens are content - Napolean

The tech used in dial-up modem communications is built on ancient concepts.

Transmitting simple information over distance has been done with smoke signals by natives of the Americas and Australian aboriginals. Ming dynasty China used [a relay system of beacon towers](https://link.springer.com/article/10.1007/s12520-021-01283-7) along the Great Wall to warn of invaders. The ancient Greeks got creative with their [Polybius square](https://en.wikipedia.org/wiki/Polybius_square) fire-signaling to describe coordinates on a grid of letters (or on a cipher grid). 

A big leap forward from Polybius happened in France during the French Revolution. Claude Chappe conceived of a semaphore telegraph which would sit above a tower. The telegraph was two indicator arms that could each be rotated to 7 distict positions, connected to a base that could rotated into a horizontal or vertical position, giving `$$7 * 7 * 2 =  98` distinct numeric codes. Each tower also had a telescope, to view other telegraphs in a chain between cities.

.tip
![](/images/chappe_telegraph.jpg)
[Télégraphe Chappe](https://commons.wikimedia.org/wiki/File:T%C3%A9l%C3%A9graphe_Chappe_1.jpg)
by [Louis Figuier](https://en.wikipedia.org/wiki/Louis_Figuier)
is licensed under public domain in France

Six of the codes were meant to convey status information, or "control codes" - start of message, no one at the station right now, etc. The remaining 92 positions were used in a two-symbol code, where each code represented a French word, giving `$$92 * 92 = 8,464` possible words. Each station would have a codebook of 92 pages, with 92 words on each page.

.tip
![](/images/chappe_codebook.png)
[ExtraitDuVocabulaire](https://commons.wikimedia.org/wiki/File:ExtraitDuVocabulaire.JPG)
by [Anne Goldenberg](https://commons.wikimedia.org/wiki/User:AnneGoldenberg)
is licensed under [GFDL-1.2-or-later](https://en.wikipedia.org/wiki/en:GNU_Free_Documentation_License)

When Napoleon came to power, he made use of these towers to communicate with his army an order of magnitude faster than the next quickest option, delivery of physical letters via horseback. This method of communication was very timely, since France's neighbors had taken a hostile stance towards them, worried about revolution spreading into their countries and their own monarchs getting their heads lopped off.

Napoleon found the chappe telegraph network so useful that he recruited Claude's brother Abraham to design a telegraph that could [communicate across the English channel](https://shannonselin.com/2020/05/chappe-semaphore-telegraph), and a mobile telegraph that could be used in Russian, which was unworkable.

Why Abraham and not Claude? Sadly, Claude suffered from depression, and under the strain of rivals declaring that they had invented the telegraph first, or made a better one, he committed suicide. His gravesite has a replica of a Chappe Telegraph, with its indicator arms set to the "at rest" control code.

.tip
![](/images/chappe_gravesite.jpg)
[Cimetière du Père Lachaise tombe de Claude Chappe](https://commons.wikimedia.org/wiki/File:Cimeti%C3%A8re_du_P%C3%A8re_Lachaise_tombe_de_Claude_Chappe.jpg)
by Mimmo109
is licensed under [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/deed.en)
