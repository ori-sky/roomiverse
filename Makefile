CLIENT_OUT=public/js/roomiverse.js
CLIENT_LIB=lib/phaser.d.ts
CLIENT_TS=$(wildcard src/client/*.ts)

.PHONY: all
all: client

.PHONY: client

client: $(CLIENT_OUT)

$(CLIENT_OUT): $(CLIENT_LIB) $(CLIENT_TS)
	tsc $^ --target ES5 --out $@

clean:
	rm -fv $(CLIENT_OUT)
