og:title A simple serverless blog
og:description Chaining cloud services to run a blog without a fixed server or HTML files
og:image https://autery.net/images/serverless/06-s3-dir.png
og:url https://autery.net/blog/topology

# A simple serverless blog

In late 2020, I was on the hunt for a good place to consolidate my blogs.

I started my writing journey around 2000 as a vehicle to learn Linux administration. It ran on a headless 386 that I kept in a closet, running Apache and some bespoke perl scripts in the cgi-bin folder. In 2005 I moved over to Blogger, and wrote missives about my love for my firstborn, and over time I transitioned more into tech deep-dives.

In 2013 I was playing around with Go and Google's "App Engine", one of their original cloud offerings, and threw together a blog engine I named [Dinghy](https://github.com/ceautery/dinghy/) that I was pretty proud of. The engine read markdown blobs from an App Engine datastore and rendered them on the fly, storing the contents in memcache to handle future requests. It contained an admin editor so I could submit new blog entries from the site itself, and everything was laid out nicely with a little Bootstrap theme. Other than this blog, I had no reason to keep current with Google cloud services, since companies I worked with either self-hosted or used AWS. When App Engine deprecated the version of Go that Dinghy was built on, I decided to move on to something else.

Which brings us to 2020. I wanted to try out this "serverless" thing I'd been hearing so much hype about. I liked the idea from Dinghy of just writing markdown, and letting the blog engine build and cache HTML. What I ended up with uses an S3 bucket that I upload markdown files and other assets to, a Lambda function to render HTML, and a Cloudfront distro to serve web requests from. Everything is also double-cached, both at Cloudfront and Cloudflare. I use Cloudflare for DNS, and also because I'm a cheap bastard and don't want to pay for any of this. I get an Amazon bill every year or two for $5, and I'm protected against a Hacker News hug of death running up my bill.

The engine is on Github as [autery.net](https://github.com/ceautery/autery.net/), and has the node.js Lambda function, a webpack config that bundles it up with the [marked](https://www.npmjs.com/package/marked) and [client-s3](https://www.npmjs.com/package/@aws-sdk/client-s3) libraries, and an archive of the blog entries.

It turns this:

```
.codez
__autery.net #__ _cat src/static/blog.md_
og:title Bytes
og:description A minimalist blog from a pretty ok software writer
og:image /images/plate.jpg

# Bytes

Things I think about

* `2025-04-08` - [Using Discrete Logarithms to Randomize a Million Integers](/blog/randomize)
* `2021-12-23` - [Audiobooks of the year, 2021](/blog/books-2021)
* `2021-12-08` - [Outsiders, TDD, and the area of a polygon](/blog/room-area)
* `2021-11-15` - [Schools and angry conservatives](/blog/krause)
* `2020-12-31` - [Books of the year, 2020](/blog/books-2020)
* `2020-11-05` - [Covid, rebirth, jobs, and elections](/blog/rebirth)
* `2017-06-01` - [How to download a web page](/blog/download-webpage)
* `2016-02-12` - [A deep dive into APL](/blog/apl)
* `2015-12-29` - [Combinatorics, brute force, and a surprising coding challenge](/blog/combinatorics)
* `2015-10-30` - [JavaScript dates, trains, Passover, and Henry VIII](/blog/dates)
* `2013-11-26` - [Calculating e with Javascript](/blog/calculating-e) - update 2023-11-17
* `2013-10-24` - [5 coding interview questions](/blog/interview-questions)
* `2013-03-13` - [Why Sheffer's Stroke is NAND instead of NOR](/blog/nand)
* `2012-06-13` - [Four ways to construct a pentagon](/blog/pentagon)
```

...into this:

```
.codez
__autery.net #__ _curl -i https://autery.net_
HTTP/2 200
date: Fri, 11 Apr 2025 14:18:30 GMT
content-type: text/html
server: cloudflare
accept-ranges: bytes
cache-control: public, max-age=86400
vary: Accept-Encoding
x-cache: Miss from cloudfront
via: 1.1 5bab46d8af126fb7ca14b6d331ff182a.cloudfront.net (CloudFront)
x-amz-cf-pop: IAD55-P8
x-amz-cf-id: _3KNlDKXOGzIQ9p0IzPpb45foyAqD_mcOocGmLXvyx4rvxsw2oQ-Hw==
cf-cache-status: MISS
last-modified: Fri, 11 Apr 2025 14:18:30 GMT
cf-ray: 92eb1d095c4ae613-IAD
alt-svc: h3=":443"; ma=86400

<meta name="og:title" content="Bytes">
<meta name="og:description" content="A minimalist blog from a pretty ok software writer">
<meta name="og:image" content="/images/plate.jpg">
<link rel="stylesheet" href="/style.css">
<link rel="me" href="https://mastodon.social/@CurtisAutery">
<meta name="viewport" content="width=500">
<meta charset="UTF-8">

<header>Curtis Autery, pretty ok software writer.</header>

<nav>
  <a href="/">blog</a>
  <a href="/about">about</a>
</nav>

<article tabindex="0">
<h1 id="bytes">Bytes</h1>
<p>Things I think about</p>
<ul>
<li><code>2025-04-08</code> - <a href="/blog/randomize">Using Discrete Logarithms to Randomize a Million Integers</a></li>
<li><code>2021-12-23</code> - <a href="/blog/books-2021">Audiobooks of the year, 2021</a></li>
<li><code>2021-12-08</code> - <a href="/blog/room-area">Outsiders, TDD, and the area of a polygon</a></li>
<li><code>2021-11-15</code> - <a href="/blog/krause">Schools and angry conservatives</a></li>
<li><code>2020-12-31</code> - <a href="/blog/books-2020">Books of the year, 2020</a></li>
<li><code>2020-11-05</code> - <a href="/blog/rebirth">Covid, rebirth, jobs, and elections</a></li>
<li><code>2017-06-01</code> - <a href="/blog/download-webpage">How to download a web page</a></li>
<li><code>2016-02-12</code> - <a href="/blog/apl">A deep dive into APL</a></li>
<li><code>2015-12-29</code> - <a href="/blog/combinatorics">Combinatorics, brute force, and a surprising coding challenge</a></li>
<li><code>2015-10-30</code> - <a href="/blog/dates">JavaScript dates, trains, Passover, and Henry VIII</a></li>
<li><code>2013-11-26</code> - <a href="/blog/calculating-e">Calculating e with Javascript</a> - update 2023-11-17</li>
<li><code>2013-10-24</code> - <a href="/blog/interview-questions">5 coding interview questions</a></li>
<li><code>2013-03-13</code> - <a href="/blog/nand">Why Sheffer&#39;s Stroke is NAND instead of NOR</a></li>
<li><code>2012-06-13</code> - <a href="/blog/pentagon">Four ways to construct a pentagon</a></li>
</ul>

</article>
<script src="/script.js"></script>
```

## The Cloudflare side

So how do all the pieces fit together? I use Cloudflare to obscure the domain name and IP address of the Cloudfront distro. So Cloudflare is just used here as a DNS proxy and a cache for content delivered from Cloudfront:

```
.codez
__autery.net #__ _curl -i https://d*************.cloudfront.net/_
HTTP/2 200
content-type: text/html
content-length: 2070
server: CloudFront
date: Fri, 11 Apr 2025 14:24:55 GMT
cache-control: public, max-age=86400
vary: Accept-Encoding
x-cache: Miss from cloudfront
via: 1.1 ff8e36e5267cb39e0ce8c3df049957a6.cloudfront.net (CloudFront)
x-amz-cf-pop: CMH68-P1
x-amz-cf-id: NLIxgXJnIuejJNXlOkzWUfub--df_-bf16ncxLbfASTBlqg0Gzb32Q==

<meta name="og:title" content="Bytes">
<meta name="og:description" content="A minimalist blog from a pretty ok software writer">
...etc
```

This forwarding happens from a CNAME DNS entry for the root domain, which is completely nonstandard. Here is the rule as the Cloudflare control panel shows it:

![](/images/serverless/01-cname-root.png)

Internally, this tells Cloudflare to periodically refresh the IP address for the destination domain, and proxy connections to it from an internal IP address, which it serves up via a plain old A record.

Let me show you what I mean. First, let's find the authoritative DNS servers for autery.net, and use one of them for the remaining `nslookup` queries.

```
.codez
__~ #__ _nslookup -type=ns autery.net_
Server:   192.168.1.1
Address:  192.168.1.1#53

Non-authoritative answer:
autery.net  nameserver = vick.ns.cloudflare.com.
autery.net  nameserver = april.ns.cloudflare.com.

Authoritative answers can be found from:
april.ns.cloudflare.com internet address = 172.64.32.66
april.ns.cloudflare.com internet address = 108.162.192.66
april.ns.cloudflare.com internet address = 173.245.58.66
vick.ns.cloudflare.com  internet address = 172.64.33.244
vick.ns.cloudflare.com  internet address = 173.245.59.244
vick.ns.cloudflare.com  internet address = 108.162.193.244
```

A plain nslookup on the domain gives 

```
.codez
__~ #__ _nslookup autery.net april.ns.cloudflare.com_
Server:   april.ns.cloudflare.com
Address:  108.162.192.66#53

Name: autery.net
Address: 104.21.77.90
Name: autery.net
Address: 172.67.205.251
```

Both of those are Cloudflare IPs, served to `nslookup` despite the DNS control panel not having a matching A record. My official rule-following engineer mind balks at this breach of a standard, but IETF RFCs are written with the idea that we're freely exchanging data on the internet, not trying to do spook stuff or lie to the end user. On the other hand, any random skimming of webserver logs will show you hack attempts, which the IETF didn't anticipate either.

If I try to look up the CNAME record itself...

```
.codez
__~ #__ _nslookup -q=cname autery.net april.ns.cloudflare.com_
Server:   april.ns.cloudflare.com
Address:  108.162.192.66#53

*** Can't find autery.net: No answer
```

...it's not there. This is all internal Cloudflare magic. Here is what a normal CNAME lookup should look like, in this case showing where autery.net's mail server really is:

```
.codez
__~ #__ _nslookup -q=cname email.autery.net april.ns.cloudflare.com_
Server:   april.ns.cloudflare.com
Address:  108.162.192.66#53

email.autery.net  canonical name = mailgun.org.
```

And that comes from this much more standard CNAME alias record:

![](/images/serverless/02-cname-email.png)

By default, Cloudflare chooses caching behavior by file extension, not the content-type header. Since I'm serving blog URLs without a file extension, I need add an explicit "cache everything" rule for all requests, and tell it to follow the cache-control header sent from the origin server.

![](/images/serverless/03-cache-rule.png)

Lastly on the Cloudflare side, this is what I typically see in logs. This shows a session where I viewed a blogged entry with images in it. The page HTML was cached, but the images weren't. This is a pretty clear hint that a bot crawled my site, and likely more bots than people visit here.

![](/images/serverless/04-cache-hit-miss.png)

## The AWS side

Here is the basic topology of the AWS services involved in this blog, courtesy of the [CloudMapper](https://github.com/duo-labs/cloudmapper/) program. Fairly straightforward. Incoming requests hit Cloudfront, Cloudfront's backing source is an S3 bucket, and implements a "behavior" on origin requests (requests from Cloudfront to the bucket) of a Lambda function.

![](/images/serverless/05-topology.png)

The S3 bucket itself is an ordinary file store, with 520 bytes of javascript to underline `blog` or `about`, pop links open in a new tab, and set focus on the main article so you can scroll with the spacebar even through the navigation header is fixed position and not in a frame. Some CSS to handle basic shell syntax highlighting and simple math rendering, and a template file to inject rendered HTML into.

![](/images/serverless/06-s3-dir.png)

The Cloudfront distro is attached to an SSL cert for autery.net managed by AWS Certificate Manager. For AWS to allow that to happen, a CNAME record had to be added with a specific alias and value that Amazon validated.

![](/images/serverless/07-cloudfront-general.png)

This allows Cloudflare to request an autery.net SSL cert from Cloudfront, and establish an HTTPS connection. I can mimic what that would look like by connecting with openssl:

```
.codez
__~ #__ _openssl s_client -connect d*************.cloudfront.net:443 -servername autery.net_
Connecting to ***.***.***.***
CONNECTED(00000007)
depth=2 C=US, O=Amazon, CN=Amazon Root CA 1
verify return:1
depth=1 C=US, O=Amazon, CN=Amazon RSA 2048 M03
verify return:1
depth=0 CN=autery.net
verify return:1
---
Certificate chain
 0 s:CN=autery.net
   i:C=US, O=Amazon, CN=Amazon RSA 2048 M03
...etc...
---
Server certificate
-----BEGIN CERTIFICATE-----
MIIFvzCCBKegAwIBAgIQDBXex7kFSt/nDY3gRICM0DANBgkqhkiG9w0BAQsFADA8
...etc...
    Start Time: 1744496176
    Timeout   : 7200 (sec)
    Verify return code: 0 (ok)
    Extended master secret: no
    Max Early Data: 0
---
read R BLOCK
_GET / HTTP/1.1_
_Host: autery.net_

HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 2070
...etc.
```

The distro has some basic behaviors such as disallowing unneeded REST methods like POST, locking in HTTPS, etc.

![](/images/serverless/08-cf-behavior-1.png)

But importantly, it sends origin requests to the `serve-blog` Lambda function. The function checks to see if a markdown file is being asked for, in which case it puts the whammy on it, otherwise it returns the original request, telling Cloudfront to serve it as a normal asset, without any data rewrites.

![](/images/serverless/09-cf-behavior-2.png)

Here's some of the Lambda function itself. It's minimized by Webpack, including the code to read raw data from S3 buckets, and the `marked` markdown processor, weighing the entire function in at 260k. [My part](https://github.com/ceautery/autery.net/blob/master/src/index.js) of that is a paltry 4k.

![](/images/serverless/10-lambda-wp-src.png)

So there you have it. A free-ish website without a fixed Linux server, where you just drop markdown files in an S3 bucket and let various cloud services manage it from there. Yes, yes I do get that the whole endeavor is a little silly, but it was a great experiment to start down the "platform engineer" path that I've been slowly nudged towards over the past few years.
