# Data Visualization Phillip Kellogg

Thank you for the opourtunity to this position, I would like to go over some of the designs and coding decisions influencing this data visualisation.

## The Goal

I wanted to keep as much of the data visable as possible while focusing on what is iportant to understand form a glance. Originally I was considering doing a connection graph similar to this.
</br>
![Connection Chart](https://cdn-images-1.medium.com/max/640/0*S6sohp4yKv3-G2FF.png)
</br>
However I ran into the issue of a 3D visualisation of this not only served no aditional purpose but was cluttered and furthermore still not displaying information like time and protocol/packet length.

## The solution

A 3D line chart was the best solution as it gave another plane of information. Despite it being an unconventional solution my vizualisation displays all the data from this JSON at once.

```json
 { "No.": 1, "Time": 0, "Source": "192.168.2.101", "Destination": "211.137.137.11", "Protocol": "UDP", "Length": 76 },

```

## Ranking data

- Time is given a percentage on the x axis by first sorting (useless in this case) then running a function to find the percentage value of the time from lowest to highest.
- IP is given a steady incremental value across the Y axis.
- Protocol is given a random position across the Z axis.
- Source and Destination are displayed by a Yellow Square and a Red Diamond respectively. They are also connected by the packet length line.
- Packet Length is shown by the color of the connecting line.

## Best wishes and thank you for this opportunity, sincerely [Phillip Kellogg!](https://phillipkellogg.com/)
