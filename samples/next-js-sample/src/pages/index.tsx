import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useFeatureFlag } from "configcat-react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { value: isEnabled, loading } = useFeatureFlag("isAwesomeFeatureEnabled", false);

  return (
    <>
      <Head>
        <title>Welcome to the ConfigCat Sample app for Next.JS</title>
        <meta name="description" content="ConfigCat sample Next.JS app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>

        <h1>
          Welcome to the ConfigCat Sample app for Next.JS!
        </h1>
        <div className={styles.logos}>
          <img width="100" alt="ConfigCat Logo" src="data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNDQuNzcgMjEwLjA3Ij48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6I2U1NGM1Yzt9LmNscy0ye2ZpbGw6I2ZmZjt9LmNscy0ze2ZpbGw6IzFhNDM0YTt9PC9zdHlsZT48L2RlZnM+PHRpdGxlPmNhdDwvdGl0bGU+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMjAxLjU3LDEwMFY0MGwtNjAsNjBIOTEuNzJsLTQwLTQwVjE5MGE2MCw2MCwwLDAsMCw2MCw2MGg5MFYxMDBaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMzUuNjIgLTQwKSIvPjxyZWN0IGNsYXNzPSJjbHMtMiIgeD0iMzQuMjIiIHk9IjgwLjQ4IiB3aWR0aD0iMTEzLjc2IiBoZWlnaHQ9IjUxLjcxIiByeD0iMjUuODUiIHJ5PSIyNS44NSIvPjxjaXJjbGUgY2xhc3M9ImNscy0zIiBjeD0iMTE5Ljk1IiBjeT0iMTA2LjMzIiByPSIyMCIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTk3LjUyLDEzMC42M2ExNiwxNiwwLDEsMS0xNiwxNiwxNiwxNiwwLDAsMSwxNi0xNm0wLTRhMjAsMjAsMCwxLDAsMjAsMjAsMjAsMjAsMCwwLDAtMjAtMjBaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMzUuNjIgLTQwKSIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTEzNS42OCwxODcuNGEyLDIsMCwwLDAtMi44MywwbC02LjEzLDYuMTMtNi4xMy02LjEzYTIsMiwwLDAsMC0yLjgzLDIuODNsNyw3djEzLjZhMiwyLDAsMCwwLDQsMHYtMTMuNmw3LTdBMiwyLDAsMCwwLDEzNS42OCwxODcuNFoiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0zNS42MiAtNDApIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNNDQuNzYsMTk1LjA2SDg1LjI5YTEuNSwxLjUsMCwxLDAsMC0zSDQ0Ljc2YTEuNSwxLjUsMCwxLDAsMCwzWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTM1LjYyIC00MCkiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik05Mi45NCwxOTkuM0gzNy4xMmExLjUsMS41LDAsMCwwLDAsM0g5Mi45NGExLjUsMS41LDAsMCwwLDAtM1oiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0zNS42MiAtNDApIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNODUuMjksMjA2LjU0SDQ0Ljc2YTEuNSwxLjUsMCwxLDAsMCwzSDg1LjI5YTEuNSwxLjUsMCwwLDAsMC0zWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTM1LjYyIC00MCkiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik0xNjguNSwxOTMuNTdIMjA5YTEuNSwxLjUsMCwxLDAsMC0zSDE2OC41YTEuNSwxLjUsMCwwLDAsMCwzWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTM1LjYyIC00MCkiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik0yMTYuNjcsMTk3LjhIMTYwLjg1YTEuNSwxLjUsMCwxLDAsMCwzaDU1LjgyYTEuNSwxLjUsMCwxLDAsMC0zWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTM1LjYyIC00MCkiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik0yMDksMjA1SDE2OC41YTEuNSwxLjUsMCwwLDAsMCwzSDIwOWExLjUsMS41LDAsMCwwLDAtM1oiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0zNS42MiAtNDApIi8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMjc1LjM0LDEzOS42MmwwLDBhMjAuMTcsMjAuMTcsMCwxLDAtMzcuNSwxNC44Myw2NS42Nyw2NS42NywwLDAsMS03OS4xNyw4NS4zNkE4Mi4xLDgyLjEsMCwwLDAsMjc1LjM0LDEzOS42MloiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0zNS42MiAtNDApIi8+PC9zdmc+"></img>
          <p className={styles.heart}>❤️</p>
          <Image
            src="/next.svg"
            alt="Next.js Logo"
            width={180}
            height={37}
            priority
          />
        </div>
        <h2>Value returned from ConfigCat for <code>isAwesomeFeatureEnabled</code>: </h2>
        {loading ? <h3>Loading...</h3> : <h3>{isEnabled ? 'On' : 'Off'}</h3>}
      </main>
    </>
  );
}
