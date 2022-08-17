# 💠 scaffold-stark

**scaffold-stark** is a forkable StarkNet dev stack focused on fast product iterations, inspired by [scaffold-eth](https://github.com/scaffold-eth/scaffold-eth). 

Drop in your Cairo smart contracts and immediately compile, deploy and interact with them through a reusable frontend UI.

<img width="1221" alt="image" src="https://user-images.githubusercontent.com/27808560/179943811-f5749cdb-ae3d-4b4d-ae6a-0fc2b3e59e3c.png">

<img width="1215" alt="image" src="https://user-images.githubusercontent.com/27808560/179943849-1bb59ae8-adb7-44c9-b1b9-ef37c1f43d26.png">

[Link](https://www.youtube.com/watch?v=G7QsyBydCik) to the product demo.

Requirements:
 - Node.js
 - Python venv
 - Yarn
 - Git
 
## Setup / Installation

1. Clone / fork 💠 scaffold-stark:
```shell
https://github.com/parketh/scaffold-stark
```

2. Run venv and install packages:
```shell
python3 -m venv cairo_venv
source cairo_venv/bin/activate
pip install -r requirements.txt
```

3. Install JS packages with yarn:
```shell
yarn install
```

4. Start starknet-devnet in first terminal window while running cairo_venv (http://localhost:5050)
```shell
starknet-devnet
```

5. Start local server in second terminal window - used to handle RPC calls (http://localhost:3001)
```shell
yarn server
```

6. Start frontend app in third terminal window (http://localhost:3000)
```shell
yarn dev
```

7. Edit your smart contracts in the `contracts/` folder and compile them with `starknet-compile` (see [docs](https://github.com/Shard-Labs/starknet-hardhat-plugin))
```shell
npx hardhat starknet-compile [PATH...]
```

8. Open [http://localhost:3000](http://localhost:3000) to see the app. Add custom frontend as you wish (Next.js + TailwindCSS).
