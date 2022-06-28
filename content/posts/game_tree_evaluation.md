---
title: "Randomized Algorithms: Game Tree Evaluation"
subtitle: ""
date: 2022-06-27T13:30:47+02:00
lastmod: 2022-06-27T13:30:47+02:00
draft: true
description: "Randomized Algorithms: Game Tree Evaluation"

tags: ["algorithms"]
math: true
trust: true
---

Imagine you are playing a game of TicTacToe against your friend. Obviously you want to find an ideal strategy to increase your chances of winning.
How can you determine your next move?

<!--more-->

### Introduction

Let us start by labeling the fields of our grid. Each game is then a series of numbers chosen alternately by you and your opponent.
Instead of writing a list of all possible games that could be played, we draw them up as a tree:

{{< svg src="static/gameTree/tictactoe-min.svg">}}

In this case `F 0` stands for marking the field `0`. The children of a node now make up all possible next moves from this state of the game. Once the game ends the corresponding branch will stop as well and we have a leaf (labeled by `v`).

The value of those leaves is given by the final state of the game: `-1` if your opponent wins, `1` if you win and `0` for a draw. Of course you want to pick your next move such that you may end up at a leave resulting in a `1`, while your opponent will try the opposite. As such one player tries to maximize the root value, while the other tries to miminize it.
So we are interested in the value of the current root of this tree.

### Problem Definition

{{< admonition type=tip title="Game Tree" open=true >}}
A game tree is a rooted tree in which internal nodes at an even distance from the root are labeled MIN and internal nodes at odd distance are labeled MAX. Each leaf is associated with a real number, its value. The goal is to determine the value of the root node.

Additionally, we are interested in the number of leaves that need to be evaluated to compute this value, any other operations are ignored.

{{< /admonition >}}

{{< svg src="static/gameTree/binaryTree.svg">}}

For ease of presentation I only consider full binary trees with values in $\lbrace 0,1 \rbrace$. 
Let such a tree be denoted as $T_{2,k}$, with $k$ layers of MAX nodes and $k$ layers of MIN nodes. Hence, the total height of the tree is $2k$ and it has $4^{k}$ leaves. As the values can be interpreted as boolean values, the two types of internal nodes can be regarded as AND respectively OR operations.

### Deterministic Algorithm

A Game Tree can be evaluated by recursively calculating the values of its child nodes. At each step the algorithm has to decide which child to regard first. This choice has to be deterministic for a deterministic algorithm. Short-circuiting may be used to skip the evaluation of the second child node if the first already returned 0 for a MIN node or 1 for a MAX node respectively. But for any deterministic choice for the order of evaluation there exists a worst case such that the algorithm needs to evaluate all $d^{2k}$ leaves. Thus, its worst case number of steps is linear in the number of leaves.

### Randomized Algorithm

The randomized algorithm works almost the same as the deterministic one.
But instead of a deterministic order for the evaluation of its children, the algorithm chooses each child node first with equal probability. The expected number of leaves that have to be evaluated can then be reduced to $3^{k}$, which is roughly $n^{0.792}$ with $n$ as the number of leaves.

### Proof

The claimed property is proved by [induction](https://en.wikipedia.org/wiki/Mathematical_induction) over $k$. First note that due to short-circuiting a MIN node evaluating to 0 and a MAX node evaluating to 1 are the same case, with the values flipped. The same is true for a MIN node evaluating to 1 and a MAX node evaluating to 0.

First consider the two cases for $k=1$.

###### MIN root 0, k=1

If a MIN root evaluates to 0, at least one of its child MAX nodes must evaluate to 0. With probability $\frac{1}{2}$ this node is selected first. In turn both its children must evaluate to 0 as well. 
Thus, picking the correct node results in $2$ leaves being evaluated ($\red{\text{red part}}$).

{{< svg src="static/gameTree/induction0.svg">}}

The other node is picked with probability $\frac{1}{2}$ as well. As it evaluates to 1, it must have at least on child with value 1. This child is again picked with probability $\frac{1}{2}$ ($\blue{\text{blue part}}$). In that case the blue and red nodes have to be considered for a total of 3. 

With probability $\frac{1}{2}$ the wrong node is selected first again ($\green{\text{green part}}$), which results in all 4 leaves being evaluated.

The expected number of leaves that have to be considered is thus:
{{< raw >}}
\begin{align*}
\red{\frac{1}{2} \cdot 2} 
+ \blue{\frac{1}{2} \cdot \frac{1}{2} \cdot 3} 
+ \green{\frac{1}{2} \cdot \frac{1}{2} \cdot 4} 
= \red{1} + \blue{\frac{3}{4}} + \green{1} \leq 3^{1}
\end{align*}
{{< /raw >}}


###### MIN root 1, k=1

On the flip side, if a MIN node evaluates to 1 both its children must be considered. But the child nodes are MAX nodes and must have at least one child node with value 1 again. With probability $\frac{1}{2}$ this node is chosen first in each case.

{{< svg src="static/gameTree/induction1.svg">}}

Once again there is also a $\frac{1}{2}$ chance for each MAX node to select the wrong leaf first, in which case both its leaves must be evaluated.

This results in an expected number of leaves to be considered:

{{< raw >}}
\begin{align*}
2 \cdot \left( \red{\frac{1}{2} \cdot 1} + \blue{\frac{1}{2} \cdot 2} \right)
= \red{1} + \blue{2} \leq 3^{1}
\end{align*}
{{< /raw >}}


As a tree with a MAX root works the same as a MIN node with all values flipped, it holds that the expected number of leaves to be considered $\mathbb{E}(T_{2,k}) \leq 3^{k}$ for $k=1$.

###### MIN root 0, $k > 1$

We now assume that our statement $\mathbb{E}(T_{2,k-1}) \leq 3^{k-1}$ holds for $k-1$. This case can be thought of and is proved equivalent to the $k=1$ case but each leaf is now another Game Tree $T_{2,k-1}$ instead. Hence, evaluating a leaf instead evaluates $\leq 3^{k-1}$ actual leaves.

Hence, the number of leaves evaluated is given by:

{{< raw >}}
\begin{align*}
\left( \red{\frac{1}{2} \cdot 2}
+ \blue{\frac{1}{2} \cdot \frac{1}{2} \cdot 3}
+ \green{\frac{1}{2} \cdot \frac{1}{2} \cdot 4} \right) \cdot 3^{k-1} \\
= \left( \red{1} + \blue{\frac{3}{4}} + \green{1} \right) \cdot 3^{k-1} 
\leq 3 \cdot 3^{k-1} = 3^{k}
\end{align*}
{{< /raw >}}

###### MIN root 1, $k > 1$
The same argument for the equivalence of this case to the case MIN node 1, $k = 1$ holds here as well, with the leaves replaced by smaller Game Trees $T_{2,k-1}$ and the expected number of leaves to be evaluated is then:

{{< raw >}}
\begin{align*}
2 \cdot \left( \red{\frac{1}{2} \cdot 1} + \blue{\frac{1}{2} \cdot 2} \right) \cdot 3^{k-1}
= \left( \red{1} + \blue{2} \right) \cdot 3^{k-1} \leq 3^{k}
\end{align*}
{{< /raw >}}

As previously mentioned, the cases for a MAX root can be proved analogously as the MIN cases.

### Conclusion

This concludes that in all cases the expected number of leaves that the randomized algorithm has to evaluate is less than or equal to $3^{k}$. Of course the worst case still has to evaluate all leaves.

Using a randomized algorithm it is, thus, possible to achieve an expected number of steps, which is strictly better than the deterministic approach.

For games with a lot of decisions like chess, the randomized algorithm is still much to slow to process the whole tree. In such cases a partial tree that only evaluates to a certain depth can be used. The values of the leaves must then be determined by the state at that time. For example giving each chess piece you hold a value depending on its position and subtracting the score of your opponent.

###### References
Motwani R. \& Raghavan P. (1995). *Randomized Algorithms*