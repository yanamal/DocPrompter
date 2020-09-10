# DocPrompter
This is a simple telepromter web app which loads a Google Drive document and, well, teleprompts it.

Honestly, I was surprised nobody has made something like this yet (or at least I couldn't find it).

The settings are mirrored in the URL, so once you've got a configuration you like, you can copy the URL and use it anywhere 
(as long as that anywhere still has access to your Google account).

There aren't very many settings or controls - you can:
- Load a file from Google Drive
- Reload the same file (if, say, you edited the doc on the computer and are telepromtping on a tablet/phone)
- Adjust the text size and scroll speed
- Mirror the text or not
- Make it scroll as soon as you press the "Start" button or not
- Start and stop scrolling by pressing the spacebar
- Control the scroll position of the text by regular browser means, e.g. mousewheel or up/down keys
- Click or tap anywhere to bring the controls back up (if they are hidden)

The app is hosted right [here](https://yanamal.github.io/DocPrompter) via GitHub Pages. 
It's an entirely client-side app (obviously, since it's hosted directly on GitHub) and it does not save or use any information about you, except for displaying the contents of a google doc you have access to.

In order to get the app to work for you, you may need to:
- Allow third-party cookies in your browser, because Google API uses third-party cookies, but also Google's browsers seem to disable third-party cookies by default (especially on mobile).
- Hit "Advanced" and "coninue anyway" on a scary warning about how my app is not verified, because "Verification may take 4-6 weeks" and there are lots of hoops to jump through. Especially for an open-source app which just does one thing.
- Agree to let the app have access to your profile picture/email/whatever - in addition to Google Drive read-only access - because apparently there is no way to turn that off. 

Actually, now I have a slightly better appreciation about why nobody has yet published a simple app like this for public use.

