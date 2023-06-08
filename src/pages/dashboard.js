import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Home() {
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [promptError, setPromptError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const prompt = e.target.prompt.value;
    const splitPrompt = prompt.split(',')
    if (splitPrompt.length > 2) {
     setPromptError("Maximum prompt size exceeded: 2");
     return;
    } else if (splitPrompt[0].length === 0) {
     setPromptError("Enter a prompt to continue");
     return;
    } else {
     setPromptError(null);
    }
    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: splitPrompt,
      }),
    });
    let prediction = await response.json();
    if (response.status !== 201) {
      setError(prediction.detail);
      return;
    }
    setPrediction(prediction);

    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      await sleep(1000);
      const response = await fetch("/api/predictions/" + prediction.id);
      prediction = await response.json();
      if (response.status !== 200) {
        setError(prediction.detail);
        return;
      }
      setPrediction(prediction);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Replicate + Next.js</title>
      </Head>

      <h1 className="text-4xl py-4">
        Stable Diffusion Text to Video Generator
      </h1>

      <p>
        Dream something:
      </p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <input autoComplete="off" type="text" name="prompt" placeholder="Enter text prompts (comma separated)" />
        <button type="submit">Go!</button>
      </form>

      {error && <div>{error}</div>}
      {promptError && <div>{promptError}</div>}

      {prediction && (
        <div>
            {prediction.output && (
              <div className={styles.imageWrapper}>
              <video
                width="50%"
                src={prediction.output}
                alt="output"
                autoplay
                controls
                loop
              />
              </div>
            )}
            <p>status: {prediction.status}</p>
        </div>
      )}
    </div>
  );
}