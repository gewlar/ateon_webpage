---
title: Using steganography to send messages hidden in an image
date: 2021-04-19T11:17:40+02:00
lastmod: 2021-04-19T11:17:40+02:00
description: A brief example of steganography
draft: false
rssFullText: true
---

There are multiple ways to send a secret message. The best known and usually used, especially over the internet, is by encrypting the message and later decrypting it.
But it's not the only possibilty. Steganography is the process of hiding information within another carrier medium, fooling everyone else into thinking that the carrier is the only message.

The basic principle ist simple:
* Add a start and end tag to our message.
* Convert the message to a byte string using UTF8.
* Overwriting the least significant bits in each pixel with our byte string until the whole message is stored.

Let's look at the last step if we want to use the two least significant bits:
As an example we want to store `10` in a channel that currently stores `10100111`. First we apply a bit mask with the 'and' operation, then we apply our data with an 'or' operation. This pixel data is then written back into the image.
```
	10100111
&	11111100
|	00000010

= 	10100110
```

If only using the least siginificant bits, the difference can not be seen. Even detecting that the image has been changed is difficult if the original can not be used as a reference.

Here are the [source files](https://github.com/gewlar/steganography) if you want to try out the application.


### Further reading:
* [https://www.garykessler.net/library/steganography.html](https://www.garykessler.net/library/steganography.html)