# Contributing to Artstone

First off, thank you for considering contributing to Artstone. It's people like you that make Artstone such a great tool.

## Where do I go from here?

If you've noticed a bug or have a feature request, make one! It's generally best if you get confirmation of your bug or approval for your feature request this way before starting to code.

## Fork & create a branch

If this is something you think you can fix, then fork Artstone and create a branch with a descriptive name.

A good branch name would be (where issue #325 is the ticket you're working on):

```sh
git switch -c 325-add-japanese-localization
```

## Install the dependencies

Make sure you've got a recent version of Node.js installed (18.x or later should work). Run `npm install` to install the project dependencies.

## Implement your fix or feature

Now you're ready to make your changes! Feel free to ask for help; everyone is a beginner at first 😸

## Make a Pull Request

At this point, you should switch back to your master branch and make sure it's up to date with Artstone's master branch:

```sh
git remote add upstream git@github.com:LordLuceus/artstone.git
git switch master
git pull upstream master
```

Then update your feature branch from your local copy of master, and push it!

```sh
git switch 325-add-japanese-localization
git rebase master
git push --set-upstream origin 325-add-japanese-localization
```

Finally, go to GitHub and [make a Pull Request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request) 😀

## Keeping your Pull Request updated

If a maintainer asks you to "rebase" your PR, they're saying that a lot of code has changed, and that you need to update your branch so it's easier to merge.

To learn more about rebasing in Git, there are a lot of [good](https://git-scm.com/book/en/v2/Git-Branching-Rebasing) [resources](https://www.atlassian.com/git/tutorials/rewriting-history/git-rebase) but here's the suggested workflow:

```sh
git switch 325-add-japanese-localization
git pull --rebase upstream master
git push --force-with-lease 325-add-japanese-localization
```

## License

By contributing your code, you agree to license your contribution under the [MIT License](LICENSE).

## Thank you

You're awesome. Thanks for reading this far. 😸
