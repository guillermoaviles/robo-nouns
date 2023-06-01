<p align="center">
  <a href="https://robonouns.wtf/">
    <img alt="Robo Noun" title="Robo Noun" src="https://user-images.githubusercontent.com/33820055/233877002-012f6f01-b367-44c6-807e-039d451c880d.png" width="550">
  </a>
</p>

<strong>RoboNouns</strong> is a project to test out a new minting mechanism for Nouns using a Variable Rate Gradual Dutch Auction mechanism instead of english auctions. RoboNouns' artwork is in the public domain. RoboNouns are born and trustlessly auctioned via a Gradual Dutch Auction, forever. Settlement of one auction kicks off the next. Artwork is generative and stored directly on-chain (not IPFS). No explicit rules exist for attribute scarcity; all Nouns are equally rare.


## The project introduces three new concepts:

### 1. Pseudo-random block traits generation
<table>
<tr>
<td>
  At the core of RoboNouns is the concept of on-chain generated NFTs with traits that change every block. This means that, approximately every ~12.1 seconds, a new NFT with distinct attributes will be created. Users can monitor the Nouns' traits as they evolve and purchase it when it matches their preferences. This approach ensures that NFTs are not only rare and valuable but also highly customizable (pseudo-randomly), catering to individual tastes and desires.
</td>
</tr>
</table>

### 2. Variable rate token issuance mechanism
<table>
<tr>
<td>
  The RoboNouns Variable Rate Gradual Dutch Auction, forked from Paradigm's implementation - https://www.paradigm.xyz/2022/08/vrgda
</td>
</tr>
</table>

### 3. On-chain pool of saved and unbought NFTs
<table>
<tr>
<td>
  RoboNouns introduces an on-chain pool of last 3 block unsold Nouns, giving users a second chance to acquire NFTs they may have missed during the 12-second block generation period. The pool maintains a record of the three most recent unsold Nouns. When a new NFT is generated, it overwrites the oldest NFT in the pool, ensuring that users always have access to a diverse selection of previously generated NFTs.
</td>
</tr>
</table>


## Technologies
<img src="https://user-images.githubusercontent.com/33820055/233872466-af7679f0-6487-41d3-8d77-93fabd7338ca.png" width=10% height=10%>&nbsp;&nbsp;&nbsp;&nbsp;<img src="https://user-images.githubusercontent.com/33820055/233872105-2f74cbec-f528-4745-99b4-fbacd5e7fdc2.svg" width=30% height=10%>&nbsp;&nbsp;&nbsp;&nbsp;<img src="https://user-images.githubusercontent.com/33820055/233872261-7fbe3789-e6a2-49b9-bdf3-758060bb453c.svg" width=30% height=10%>&nbsp;&nbsp;&nbsp;&nbsp;<img src="https://user-images.githubusercontent.com/33820055/233872845-df32deed-0b0d-46ba-a3fe-ae8c254f81f1.svg" width=10% height=10%>&nbsp;&nbsp;&nbsp;&nbsp;<img src="https://user-images.githubusercontent.com/33820055/233872952-88d2b0f9-c977-44bc-94fc-6516950467a2.svg" width=10% height=10%>

## Contributors
<a href="https://twitter.com/guille_aviles" target="_blank">@guille_aviles</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="https://twitter.com/zeroxvee" target="_blank">@zeroxvee</a>

## Acknowledgements 

Special thanks to <a href="https://twitter.com/0xWiz_" target="_blank">@0xWiz_</a> for introducing us to the <a href="https://nouns.wtf/" target="_blank">Nouns</a> community and supporting us throughout this project.
