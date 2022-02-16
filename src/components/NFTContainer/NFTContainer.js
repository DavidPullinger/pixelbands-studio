import { useState, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { fetchNFTsOwnedByWallet } from "../../controllers/fetchNFTsByWallet";
import Flickity from "react-flickity-component";
import "./flickity.css";
import NFTCard from "../NFTCard/NFTCard";
import "./NFTContainer.css";
import drumborder from "../../assets/drumborder.png";
import guitarborder from "../../assets/guitarborder.png";
import bassborder from "../../assets/bassborder.png";
import pianoborder from "../../assets/pianoborder.png";
import mint_btn from "../../assets/mintbutton.png";
import play_btn from "../../assets/playbutton.png";
import coming_soon from "../../assets/comingsoon.png";
import pause_btn from "../../assets/pausebutton.png";
import mint from "../../controllers/mintBands";
import findAssociatedTokenAddress from "../../controllers/findAssociatedTokenAccount";
import { PublicKey } from "@solana/web3.js";

function NFTContainer() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const { publicKey } = wallet;
  const [fetching, setFetching] = useState(false);
  const [NFTs, setNFTs] = useState([]);
  const [passes, setPasses] = useState([]);
  const [numLoaded, setNumLoaded] = useState(0);
  const incrLoaded = () => {
    setNumLoaded(numLoaded + 1);
  };
  const [latestDropdown, setLatestDropdown] = useState(null);
  const [currentDrum, setCurrentDrum] = useState(null);
  const [currentGuitar, setCurrentGuitar] = useState(null);
  const [currentBass, setCurrentBass] = useState(null);
  const [currentPiano, setCurrentPiano] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loopTimer, setLoopTimer] = useState(null);

  const flickityOptions = {
    cellAlign: "center",
    groupCells: true,
    pageDots: false,
  };
  let dropdownTimer;

  const fetchNFTs = () => {
    // reset state as if NFTs were not fetched
    setNFTs([]);
    setFetching(true);
    setNumLoaded(0);
    // continue
    fetchNFTsOwnedByWallet(publicKey, connection).then((data) => {
      setFetching(false);
      fetchNFTData(data);
    });
  };

  useEffect(() => {
    if (publicKey) {
      fetchNFTs();
    }
    // eslint-disable-next-line
  }, [publicKey]);

  const fetchNFTData = (NFTs) => {
    NFTs.forEach((item) => {
      if (
        item.updateAuthority === "9kv7dpjENe8C5Et8N8HduM63z7PS4erbCyy25PCp8G4w"
      ) {
        fetch(item.data.uri)
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            setNFTs((NFTs) => [
              ...NFTs,
              {
                name: data.name,
                url: data.animation_url,
                role: data.attributes.find((el) => {
                  return el.trait_type === "Instrument";
                }).value,
              },
            ]);
          });
      } else if (
        item.updateAuthority === "DFUhTiYEYKNJ6nd5pFbnKx6XGSvBSMQUHj8ThMJ4ct9F"
      ) {
        findAssociatedTokenAddress(
          wallet.publicKey,
          new PublicKey(item.mint)
        ).then((res) =>
          setPasses((passes) => [
            ...passes,
            {
              mint: item.mint,
              token: res.toString(),
            },
          ])
        );
      }
    });
  };

  const showDropdown = (el) => {
    document.getElementById("nft-dropdown").className =
      "nft-dropdown nft-dropdown-visible";
    el.style.transform = "rotate(-90deg)";
  };
  const hideDropdown = () => {
    document.getElementById("nft-dropdown").className =
      "nft-dropdown nft-dropdown-hidden";
    latestDropdown.style.transform = "rotate(0deg)";
    // we want NFT cards to be hoverable and thus z-index of hidden dropdown must be lower than all
    // for a smooth disappearance animation, we want this to only happen after opacity is 0
    setTimeout(
      () =>
        (document.getElementById("nft-dropdown").className =
          "nft-dropdown nft-dropdown-hidden behind-all"),
      200
    );
  };

  const makeNFTCards = () => {
    let guitar = [];
    let bass = [];
    let drums = [];
    let piano = [];

    NFTs.forEach((item) => {
      switch (item.role) {
        case "Guitar":
          guitar.push(item);
          break;
        case "Bass":
          bass.push(item);
          break;
        case "Drums":
          drums.push(item);
          break;
        case "Keyboard":
          piano.push(item);
          break;
        default:
          break;
      }
    });

    const dropDownItems = (id) => {
      switch (id) {
        case "drums":
          return drums.map((el) => {
            return (
              <div
                key={el.name}
                className={
                  !currentDrum && el === drums[0]
                    ? "selected"
                    : el === currentDrum
                    ? "selected"
                    : ""
                }
              >
                <NFTCard
                  bandMember={el}
                  border={drumborder}
                  onClick={() => {
                    setCurrentDrum(el);
                    resetMusic();
                    if (isPlaying) toggleMusicPlay();
                  }}
                />
              </div>
            );
          });
        case "guitar":
          return guitar.map((el) => {
            return (
              <div
                key={el.name}
                className={
                  !currentGuitar && el === guitar[0]
                    ? "selected"
                    : el === currentGuitar
                    ? "selected"
                    : ""
                }
              >
                <NFTCard
                  bandMember={el}
                  border={guitarborder}
                  onClick={() => {
                    setCurrentGuitar(el);
                    resetMusic();
                    if (isPlaying) toggleMusicPlay();
                  }}
                />
              </div>
            );
          });
        case "bass":
          return bass.map((el) => {
            return (
              <div
                key={el.name}
                className={
                  !currentBass && el === bass[0]
                    ? "selected"
                    : el === currentBass
                    ? "selected"
                    : ""
                }
              >
                <NFTCard
                  bandMember={el}
                  border={bassborder}
                  onClick={() => {
                    setCurrentBass(el);
                    resetMusic();
                    if (isPlaying) toggleMusicPlay();
                  }}
                />
              </div>
            );
          });
        case "keyboard":
          return piano.map((el) => {
            return (
              <div
                className={
                  !currentPiano && el === piano[0]
                    ? "selected"
                    : el === currentPiano
                    ? "selected"
                    : ""
                }
                key={el.name}
              >
                <NFTCard
                  bandMember={el}
                  border={pianoborder}
                  onClick={() => {
                    setCurrentPiano(el);
                    resetMusic();
                    if (isPlaying) toggleMusicPlay();
                  }}
                />
              </div>
            );
          });
        default:
          return null;
      }
    };

    return (
      <div className="cardContainer">
        <div>
          <h2>
            Drummer
            {drums.length > 1 ? (
              <i
                id="drums"
                className="material-icons"
                onMouseLeave={() =>
                  (dropdownTimer = setTimeout(() => hideDropdown(), 150))
                }
                onMouseEnter={(el) => {
                  setLatestDropdown(el.target);
                  showDropdown(el.target);
                }}
              >
                expand_more
              </i>
            ) : null}
          </h2>
          {drums.length > 0 ? (
            <NFTCard
              bandMember={currentDrum ? currentDrum : drums[0]}
              onLoad={incrLoaded}
              border={drumborder}
              controls
            />
          ) : (
            <NFTCard redirect="Drummer" />
          )}
        </div>
        <div>
          <h2>
            Guitarist
            {guitar.length > 1 ? (
              <i
                id="guitar"
                className="material-icons"
                onMouseLeave={() =>
                  (dropdownTimer = setTimeout(() => hideDropdown(), 150))
                }
                onMouseEnter={(el) => {
                  setLatestDropdown(el.target);
                  showDropdown(el.target);
                }}
              >
                expand_more
              </i>
            ) : null}
          </h2>
          {guitar.length > 0 ? (
            <NFTCard
              bandMember={currentGuitar ? currentGuitar : guitar[0]}
              onLoad={incrLoaded}
              border={guitarborder}
              controls
            />
          ) : (
            <NFTCard redirect="Guitarist" />
          )}
        </div>
        <div>
          <h2>
            Bassist
            {bass.length > 1 ? (
              <i
                id="bass"
                className="material-icons"
                onMouseLeave={() =>
                  (dropdownTimer = setTimeout(() => hideDropdown(), 150))
                }
                onMouseEnter={(el) => {
                  setLatestDropdown(el.target);
                  showDropdown(el.target);
                }}
              >
                expand_more
              </i>
            ) : null}
          </h2>
          {bass.length > 0 ? (
            <NFTCard
              bandMember={currentBass ? currentBass : bass[0]}
              onLoad={incrLoaded}
              border={bassborder}
              controls
            />
          ) : (
            <NFTCard redirect="Bassist" />
          )}
        </div>

        <div>
          <h2>
            Keyboardist
            {piano.length > 1 ? (
              <i
                id="keyboard"
                className="material-icons"
                onMouseLeave={() =>
                  (dropdownTimer = setTimeout(() => hideDropdown(), 150))
                }
                onMouseEnter={(el) => {
                  setLatestDropdown(el.target);
                  showDropdown(el.target);
                }}
              >
                expand_more
              </i>
            ) : null}
          </h2>
          {piano.length > 0 ? (
            <NFTCard
              bandMember={currentPiano ? currentPiano : piano[0]}
              onLoad={incrLoaded}
              border={pianoborder}
              controls
            />
          ) : (
            <NFTCard redirect="Pianist" />
          )}
        </div>
        <div
          onMouseEnter={() => clearTimeout(dropdownTimer)}
          onMouseLeave={() => hideDropdown()}
          id="nft-dropdown"
          className="nft-dropdown nft-dropdown-hidden behind-all"
        >
          <Flickity
            className={"carousel"} // default ''
            elementType={"div"} // default 'div'
            options={flickityOptions} // takes flickity options {}
          >
            {dropDownItems(latestDropdown?.id)}
          </Flickity>
        </div>
      </div>
    );
  };

  function PauseableTimeout(fn, delay) {
    let trigger_time = Date.now() + delay;
    let remaining_time = delay;
    let mainTimer;

    const pause = () => {
      clearTimeout(mainTimer);
      remaining_time = trigger_time - Date.now();
    };

    const resume = () => {
      mainTimer = setTimeout(fn, remaining_time);
      trigger_time = Date.now() + remaining_time;
    };

    const cancel = () => {
      clearTimeout(mainTimer);
    };

    mainTimer = setTimeout(fn, delay);
    return { cancel: cancel, pause: pause, resume: resume };
  }

  const resetMusic = () => {
    loopTimer?.cancel();
    setLoopTimer(null);
    let videos = Array.from(document.querySelectorAll("video")).filter(
      (v) => v.className === "video active"
    );
    videos.forEach((v) => {
      v.currentTime = 0;
    });
  };

  const loopMusic = () => {
    let videos = Array.from(document.querySelectorAll("video")).filter(
      (v) => v.className === "video active"
    );
    videos.forEach((v) => {
      v.currentTime = 0;
    });
    // start new timer
    let x = new PauseableTimeout(loopMusic, 25 * 1000);
    setLoopTimer(x);
  };

  const toggleMusicPlay = () => {
    if (isPlaying) {
      pauseMusic();
      setIsPlaying(false);
      document.getElementById("play").src = play_btn;
    } else {
      if (playMusic()) {
        setIsPlaying(true);
        document.getElementById("play").src = pause_btn;
      }
    }
  };

  const playMusic = () => {
    // get videos that are not in dropdown and reset time
    let videos = Array.from(document.querySelectorAll("video")).filter(
      (v) => v.className === "video active"
    );
    // check if we can play them all
    if (numLoaded < videos.length) {
      const err = document.getElementById("error");
      err.innerHTML = "Your band members are still getting ready!";
      setTimeout(() => (err.innerHTML = ""), 2000);
      return false;
    }
    videos.forEach((v) => {
      v.play();
    });
    // start or resume timer to loop songs
    if (loopTimer) {
      loopTimer.resume();
    } else {
      let x = new PauseableTimeout(loopMusic, 25 * 1000);
      setLoopTimer(x);
    }
    return true;
  };

  const pauseMusic = () => {
    let videos = Array.from(document.querySelectorAll("video")).filter(
      (v) => v.className === "video active"
    );
    videos.forEach((v) => {
      v.pause();
    });
    // pause timer to loop songs
    loopTimer.pause();
  };

  return publicKey ? (
    <div className="wrapper">
      <p className="intro">
        Play your musicians' sound or combine musicians to hear your full band!
        <br />
        Mint your full band into a UNIQUE full band NFT.
      </p>
      {fetching ? (
        <p className="intro">Fetching all your band members...</p>
      ) : (
        <div className="nft-wrapper">
          <p id="error"></p>
          {makeNFTCards()}
          <div className="buttons-wrapper">
            <img
              id="play"
              onClick={toggleMusicPlay}
              src={play_btn}
              alt="play btn"
            />
            <div
              className="btn-swapper"
              onMouseEnter={() => {
                document.getElementById("mint").style.opacity = 0;
                document.getElementById("soon").style.opacity = 1;
              }}
              onMouseLeave={() => {
                document.getElementById("soon").style.opacity = 0;
                document.getElementById("mint").style.opacity = 1;
              }}
              onClick={() => mint(connection, wallet, passes)}
            >
              <img id="mint" src={mint_btn} alt="mint btn" className="btn" />
              <img
                id="soon"
                src={coming_soon}
                alt="coming soon"
                className="hidden btn"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  ) : (
    <div className="main">
      <p>
        Play your musicians' sound or combine musicians to hear your full band!
        <br />
        Mint your full band into a UNIQUE full band NFT.{" "}
        <span
          className="intext-button"
          onClick={() => {
            document
              .getElementsByClassName("wallet-adapter-button-trigger")[0]
              .click();
          }}
        >
          Connect your wallet
        </span>{" "}
        to get started!
      </p>
      <div className="gif-wrapper">
        <NFTCard redirect="Drummer" />
        <NFTCard redirect="Guitarist" />
        <NFTCard redirect="Bassist" />
        <NFTCard redirect="Pianist" />
      </div>
      <div className="buttons-wrapper-disabled">
        <img src={play_btn} alt="play btn" />
        <img src={mint_btn} alt="mint btn" />
      </div>
    </div>
  );
}

module.exports = NFTContainer;
