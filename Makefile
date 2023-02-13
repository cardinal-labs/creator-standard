.PHONY: build

TEST_KEY := $(shell solana-keygen pubkey ./tests/test-keypairs/test-key.json)

all: build start test stop

build:
	cargo build-bpf
	yarn idl:generate && yarn solita && yarn lint

start:
	solana-test-validator --url https://api.devnet.solana.com \
		--clone metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s --clone PwDiXFxQsGra4sFFTT8r1QWRMd4vfumiWC1jfWNfdYT \
		--clone 2NjwBshDhNPyGXmYU2VBnWySvgqg1hiEAY2CPeNCd4qf \
		--clone EBs1boZXeJHZpNxi6WJeWN3sBtZH1fMe5x8owCg2Z4Z7 \
		--clone 67breUU4gNRwXdNtMd7Qv7sdtKSaPu1vxWbtGrGm1ywL \
		--bpf-program ccsxqYAg64wuLEh45KabyPvkKjrEfDPsDZUQrGn7mf3 ./target/deploy/cardinal_creator_standard.so \
		--reset --quiet & echo $$! > validator.PID
	sleep 8
	solana airdrop 1000 $(TEST_KEY) --url http://localhost:8899

test:
	yarn test

stop:
	pkill solana-test-validator