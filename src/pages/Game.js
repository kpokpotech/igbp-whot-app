import React, { useState } from "react";
import igbo from "../i18n/igbo";

export default function Game() {
  const [topCard, setTopCard] = useState("/assets/cards/eke_abuo.png");
  const [playerCards, setPlayerCards] = useState([
    "/assets/cards/orie_otu.png",
    "/assets/cards/afor_isii.png"
  ]);

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold">{igbo.messages.start}</h2>

      <div className="my-4">
        <p>{igbo.messages.topCard}:</p>
        <img src={topCard} alt="Top Card" className="h-24 mx-auto" />
      </div>

      <div>
        <p>{igbo.messages.yourCards}:</p>
        <div className="flex gap-2 flex-wrap">
          {playerCards.map((card, index) => (
            <img
              key={index}
              src={card}
              alt="card"
              className="h-20 cursor-pointer"
              onClick={() => alert(`Ị họrọla ${card}`)}
            />
          ))}
        </div>
      </div>

      <button
        onClick={() => alert("Were Kaadị (Draw Card)")}
        className="bg-yellow-500 px-4 py-2 rounded mt-4"
      >
        Were Kaadị
      </button>
    </div>
  );
}