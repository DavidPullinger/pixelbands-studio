import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Mint.css";
import { HomeIcon, XIcon } from "@heroicons/react/solid";
import { videos, banners } from "./assets";
import Flickity from "react-flickity-component";
import "../components/NFTContainer/flickity.css";
import { mint, stake } from "../controllers/mintBands";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import loading from "url:../assets/loading.mp4";
import mint_btn from "../assets/mintbutton.png";
import cancel_btn from "../assets/cancelbutton.png";
import preview_btn from "../assets/previewbutton.png";
import console from "console";

function Mint(props) {
  const [currentBackground, setCurrentBackground] = useState(videos?.[0]);
  const [currentBanner, setCurrentBanner] = useState(banners?.[0]);
  const [videoUrl, setVideoUrl] = useState();
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [minting, setMinting] = useState(false);
  const [mintSuccess, setMintSuccess] = useState();
  const [mintError, setMintError] = useState();
  const { connection } = useConnection();
  const wallet = useWallet();
  let navigate = useNavigate();

  const bgBucketUrl =
    "https://ipfs.io/ipfs/bafybeidqcjzp7vl3eb57riebgjxulgytew4nzc2lgpvdexxs43nq4ygyha/";
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
          <img className="w-80 pb-8" src={bgBucketUrl + vid + ".gif"} />
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
    setVideoUrl(loading);
    fetch("http://localhost:8888/createband", {
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
        background: currentBackground,
        banner: currentBanner,
        bandName: document.getElementById("bandNameInput").value ?? "",
        userPubkey: wallet.publicKey.toBase58(),
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        setVideoLoaded(true);
        setVideoUrl(result.url + "/band.mp4");
      });
  };

  const fetchMetadataAndMint = () => {
    // visuals
    setVideoUrl(loading);
    setVideoLoaded(false);
    setMinting(true);
    // get metadata
    fetch("http://localhost:8888/getmetadata", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({
        dirLink: videoUrl.slice(0, -9),
        keys: props.bandMembers.filter((el) => el.role === "Keyboard")?.[0],
        drums: props.bandMembers.filter((el) => el.role === "Drums")?.[0],
        bass: props.bandMembers.filter((el) => el.role === "Bass")?.[0],
        guitar: props.bandMembers.filter((el) => el.role === "Guitar")?.[0],
        owner: wallet.publicKey.toBase58(),
        background: currentBackground,
        banner: currentBanner,
        bandName: document.getElementById("bandNameInput").value ?? "",
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then(async (result) => {
        // stake 4 band members
        stake(connection, wallet, props.bandMembers)
          .then(() => {
            mint(connection, wallet, props.passes, result.url)
              .then((res) => {
                setVideoLoaded(false);
                console.log(res);
                setMintSuccess(
                  `LFG! You minted your band! Find it at: https://solscan.io/token/${res?.mint}`
                );
              })
              .catch((err) => {
                setVideoLoaded(false);
                console.log(err);
                setMintError(
                  `Something went wrong. Please note the following error for reference: ${err}`
                );
              });
          })
          .catch((err) => {
            setVideoLoaded(false);
            console.log(err);
            setMintError(
              `Something went wrong. Please note the following error for reference: ${err}`
            );
          });
      });
  };

  return (
    <div className="relative py-4 px-8 flex flex-col gap-8 items-center justify-center bg-[#040505]">
      <button onClick={fetchMetadataAndMint}>test</button>
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
          type={"text"}
        ></input>
      </div>
      <div className="w-full flex gap-28">
        <div className="flex flex-col gap-6">{makeMemberCards()}</div>
        <div className="flex-grow grid grid-rows-[2fr_1fr] gap-6">
          <Backgrounds />
          <Banners />
        </div>
      </div>
      <img
        className="mt-8 squish w-1/6 pb-8"
        onClick={makeBand}
        src={preview_btn}
      />
      {videoUrl ? (
        <div className="w-full h-full flex justify-center items-center backdrop-blur-lg absolute">
          <div className="max-w-[40%] w-auto">
            {mintError || mintSuccess ? (
              <img
                className="max-w-[80%] m-auto rounded-md"
                src={
                  mintError
                    ? "https://media4.giphy.com/media/ISOckXUybVfQ4/giphy.gif?cid=ecf05e47ve44cej41o2ou730p9yfdym1wcbjs2bmxd7llpu5&rid=giphy.gif&ct=g"
                    : "https://media.giphy.com/media/jPBlSAfeQts9goDVC4/giphy.gif"
                }
                alt="sad spongebob"
              />
            ) : (
              <video
                autoPlay
                id="mint-video"
                loop
                className="rounded-md"
                src={videoUrl}
                controls={videoLoaded}
              ></video>
            )}
            {videoLoaded ? (
              <div className="flex justify-center items-center gap-8 mt-6">
                <img
                  onClick={fetchMetadataAndMint}
                  className="w-1/3 squish"
                  src={mint_btn}
                  alt="mint btn"
                />
                <img
                  onClick={() => {
                    setVideoUrl(null);
                    setVideoLoaded(false);
                  }}
                  className="w-1/3 squish"
                  src={cancel_btn}
                  alt="cancel btn"
                />
              </div>
            ) : minting ? (
              mintError || mintSuccess ? (
                <div className="flex flex-col justify-center items-center m-auto">
                  <p className="player-font mt-4 break-words">
                    {mintError ? mintError : mintSuccess}
                  </p>
                  <Link
                    to="/"
                    className="player-font mt-6 break-words m-auto underline flex w-[80%] justify-center items-end gap-4"
                  >
                    <HomeIcon className="w-8" />
                    Return home
                  </Link>
                </div>
              ) : (
                <p className="player-font mt-4 ">Minting your band...</p>
              )
            ) : (
              <p className="player-font mt-4 ">
                Preparing your band...
                <br />
                This should take between
                <br />1 and 2 minutes
              </p>
            )}
          </div>
        </div>
      ) : null}
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
