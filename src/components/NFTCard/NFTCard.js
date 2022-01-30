import "./NFTCard.css";
import buttons from "../../assets/controls/buttons.png";
import dial from "../../assets/controls/dial.png";

function NFTCard(props) {
  const emoji = () => {
    switch (props.redirect) {
      case "Guitarist":
        return "🎸";
      case "Bassist":
        return "🪕";
      case "Drummer":
        return "🥁";
      case "Pianist":
        return "🎹";
      default:
        return "";
    }
  };

  const { name, url } = props.bandMember || {};
  return (
    <div onClick={props.onClick || null} className="grid-item-wrapper">
      {!props.redirect ? (
        <div className="card-wrapper">
          <div
            id={name}
            style={{ backgroundImage: "url(" + props.border + ")" }}
            className="card"
          >
            <video
              onLoadedData={props.onLoad}
              // this is used to see if this element is in dropdown or not
              className={props.controls ? "video active" : "video"}
              alt="NFT"
              preload="auto"
              loop
              src={url}
            ></video>
          </div>
          {props.controls ? (
            <div className="controls">
              <img className="buttons" src={buttons} alt="buttons" />
              <img className="dial" src={dial} alt="dial" />
              <div></div>
            </div>
          ) : null}
        </div>
      ) : (
        <a
          rel="noreferrer"
          target="_blank"
          href="https://magiceden.io/marketplace/pixelbands"
        >
          <div className="empty-card">
            <h1>{emoji()}➕</h1>
          </div>
        </a>
      )}
    </div>
  );
}

export default NFTCard;
