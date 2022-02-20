import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Mint.css";
import { XIcon } from "@heroicons/react/solid";
import { videos, banners } from "./assets";
import Flickity from "react-flickity-component";
import "../components/NFTContainer/flickity.css";
import { mint } from "../controllers/mintBands";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

function Mint(props) {
  const [currentBackground, setCurrentBackground] = useState(videos?.[0]);
  const [currentBanner, setCurrentBanner] = useState(banners?.[0]);
  const { connection } = useConnection();
  const wallet = useWallet();
  let navigate = useNavigate();

  const bgBucketUrl =
    "https://ipfs.io/ipfs/bafybeihdzlcptccyw7stgexxjpvdkypimchw4n2gx2hvpmynqyp4rumj64/";
  const bannerBucketUrl =
    "https://ipfs.io/ipfs/bafybeigxjthygqtuqhnndno4et3dptdmmsujdvz7ssdhucfy6tn4se7ixi/";
  const flickityOptions = {
    cellAlign: "left",
    groupCells: true,
    pageDots: false,
  };

  useEffect(() => {
    if (!props.bandMembers || props.bandMembers?.length < 4) navigate("/");
  }, [props.bandMembers]);

  const makeMemberCards = () => {
    return props.bandMembers?.map((el) => {
      return (
        <div key={el.name} className="flex gap-8 player-font items-center">
          <p className="w-[9ch]">{el.role}:</p>
          <img className="w-48" src={el.url.slice(0, -3) + "gif"} />
        </div>
      );
    });
  };

  const makeBackgroundCards = () => {
    return videos?.map((vid) => {
      return (
        <div
          className={
            vid === currentBackground ? "border-2 rounded-md px-8 pt-8" : "px-8"
          }
          key={vid}
          onClick={() => setCurrentBackground(vid)}
        >
          <video className="w-80 pb-8" src={bgBucketUrl + vid + ".mp4"}></video>
          <p>{vid}</p>
        </div>
      );
    });
  };

  const makeBannerCards = () => {
    return banners?.map((banner) => {
      return (
        <div
          className={
            banner === currentBanner ? "border-2 rounded-md px-8 pt-8" : "px-8"
          }
          key={banner}
          onClick={() => setCurrentBanner(banner)}
        >
          <img className="w-80 pb-8" src={bannerBucketUrl + banner + ".png"} />
          <p>{banner}</p>
        </div>
      );
    });
  };

  const makeBand = () => {
    fetch("https://pixelbands-api.herokuapp.com/createband", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({
        bass: props.bandMembers.filter((el) => el.role === "Bass")?.[0].url,
        guitar: props.bandMembers.filter((el) => el.role === "Guitar")?.[0].url,
        drums: props.bandMembers.filter((el) => el.role === "Drums")?.[0].url,
        keyboard: props.bandMembers.filter((el) => el.role === "Keyboard")?.[0]
          .url,
        bassVol: sessionStorage.getItem("Bass") ?? 1,
        guitarVol: sessionStorage.getItem("Guitar") ?? 1,
        drumsVol: sessionStorage.getItem("Drums") ?? 1,
        keysVol: sessionStorage.getItem("Keyboard") ?? 1,
        background: encodeURIComponent(currentBackground),
        banner: currentBanner,
        bandName: document.getElementById("bandNameInput").value ?? "",
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        mint(connection, wallet, props.passes, result);
      });
  };

  return (
    <div className="py-4 px-8 flex flex-col gap-8 items-center justify-center bg-[#040505]">
      <Link to="/" className="top-8 right-8 fixed">
        <XIcon className="h-10 w-10  hover:rotate-45 transition-transform" />
      </Link>
      <div
        className="w-[400px] h-[400px] px-4 rounded-full"
        style={{
          backgroundImage:
            "url(https://vsew67gnzmwwxo5oqnyrxbapdtseqnbxejq63l3fvvhfbbtn2qpa.arweave.net/rIlvfM3LLWu7roNxG4QPHORINDciYe2vZa1OUIZt1B4/?ext=gif)",
          boxShadow: "0 0 20px 20px #040505 inset",
        }}
      ></div>
      <h1 className="text-4xl pb-16">Mint your band!</h1>
      <div className="w-full flex justify-center gap-4 player-font pb-16 items-center">
        <p>Band Name (max 14 characters):</p>
        <input
          id="bandNameInput"
          maxLength={14}
          className="rounded-md text-black p-2 w-[18ch]"
        ></input>
      </div>
      <div className="w-full flex gap-28">
        <div className="flex flex-col gap-6">{makeMemberCards()}</div>
        <div className="flex-grow grid grid-rows-[2fr_1fr] gap-6">
          <Backgrounds />
          <Banners />
        </div>
      </div>
      <button
        onClick={makeBand}
        className="border-2 text-2xl rounded-lg p-2 mt-3"
      >
        Preview Band
      </button>
    </div>
  );

  function Backgrounds() {
    return (
      <div className="w-full flex flex-col justify-start">
        <p className="player-font pb-8">Background:</p>
        <Flickity
          className={"carousel"} // default ''
          elementType={"div"} // default 'div'
          options={flickityOptions} // takes flickity options {}
        >
          {makeBackgroundCards()}
        </Flickity>
      </div>
    );
  }

  function Banners() {
    return (
      <div className="w-full flex flex-col justify-start">
        <p className="player-font pb-8">Banner:</p>
        <Flickity
          className={"carousel"} // default ''
          elementType={"div"} // default 'div'
          options={flickityOptions} // takes flickity options {}
        >
          {makeBannerCards()}
        </Flickity>
      </div>
    );
  }
}

module.exports = Mint;
