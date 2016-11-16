# Mixable - Listen Together

## Quick Start

One person uses the `--leader` flag. The rest follow along.

```bash
$ ./mixable --leader
Leading the session.
1479319504195 set play spotify:track:2gk0dz4eibPhePsRutRod9 66.058
1479319515372 set play spotify:track:0HzuySXVnDgpR9xArMI2DL 0.001
1479319519562 set play spotify:track:15GXfYnNQ0zJ4zdlsYT9Nl 0.002
1479319547716 set play spotify:track:0W2275seLSrfjHxeWmDb6l 0
```

```bash
$ ./mixable
1479319504195 get play spotify:track:2gk0dz4eibPhePsRutRod9 66.058
1479319515372 get play spotify:track:0HzuySXVnDgpR9xArMI2DL 0.001
1479319519562 get play spotify:track:15GXfYnNQ0zJ4zdlsYT9Nl 0.002
1479319547716 get play spotify:track:0W2275seLSrfjHxeWmDb6l 0
```