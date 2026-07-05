import './Postcard.css';

// Pixel-for-pixel port of project/Postcard.dc.html — the scene illustration is
// built from plain shapes (sun/moon/clouds/hills/sea/flowers/stars) driven by
// the `scene` object from src/data/scenes.js.
export default function Postcard({ greeting, sender, message, quoteText, quoteAuthor, scene, bandH = '210px' }) {
  return (
    <div className="postcard">
      <div className="postcard-card">
        <div className="postcard-band" style={{ height: bandH }}>
          <div className="postcard-sky" style={{ background: scene.skyGrad }} />

          {scene.hasStars && (
            <>
              <span className="postcard-star" style={{ top: '14%', left: '16%', width: 4, height: 4, boxShadow: '0 0 6px #FFF6D6' }} />
              <span className="postcard-star" style={{ top: '26%', left: '38%', width: 3, height: 3 }} />
              <span className="postcard-star" style={{ top: '10%', left: '60%', width: 5, height: 5, boxShadow: '0 0 6px #FFF6D6' }} />
              <span className="postcard-star" style={{ top: '32%', left: '76%', width: 3, height: 3 }} />
              <span className="postcard-star" style={{ top: '20%', left: '88%', width: 4, height: 4, boxShadow: '0 0 5px #FFF6D6' }} />
              <span className="postcard-star" style={{ top: '42%', left: '28%', width: 3, height: 3 }} />
              <span className="postcard-star" style={{ top: '46%', left: '66%', width: 3, height: 3 }} />
            </>
          )}

          {scene.hasMoon && (
            <div
              className="postcard-moon"
              style={{
                background: scene.moonColor,
                boxShadow: '0 0 22px rgba(251,233,176,0.55), inset -14px -6px 0 rgba(0,0,0,0.06)',
              }}
            />
          )}

          {scene.hasSun && (
            <div
              className="postcard-sun"
              style={{
                top: scene.sunTop,
                left: scene.sunLeft,
                width: scene.sunSize,
                height: scene.sunSize,
                background: scene.sunColor,
                boxShadow: `0 0 0 8px rgba(255,255,255,0.18), 0 0 34px ${scene.sunColor}`,
              }}
            />
          )}

          {scene.hasClouds && (
            <>
              <div className="postcard-cloud" style={{ top: '22%', left: '12%' }}>
                <div className="postcard-cloud-body" style={{ width: 58, height: 24, background: scene.cloudColor }} />
                <div className="postcard-cloud-puff" style={{ top: -14, left: 12, width: 30, height: 30, background: scene.cloudColor }} />
                <div className="postcard-cloud-puff" style={{ top: -9, left: 32, width: 22, height: 22, background: scene.cloudColor }} />
              </div>
              <div className="postcard-cloud" style={{ top: '38%', right: '16%' }}>
                <div className="postcard-cloud-body" style={{ width: 44, height: 18, background: scene.cloudColor }} />
                <div className="postcard-cloud-puff" style={{ top: -10, left: 10, width: 22, height: 22, background: scene.cloudColor }} />
              </div>
            </>
          )}

          {scene.hasSea && (
            <>
              <div
                className="postcard-sea"
                style={{ background: `linear-gradient(180deg, ${scene.seaColor}, rgba(0,0,0,0.12))` }}
              />
              <div className="postcard-wave" style={{ bottom: '30%', height: 5, background: 'rgba(255,255,255,0.35)' }} />
              <div className="postcard-wave" style={{ bottom: '16%', height: 4, background: 'rgba(255,255,255,0.25)' }} />
            </>
          )}

          {scene.hasHills && (
            <>
              <div className="postcard-hill" style={{ bottom: -46, left: '-12%', width: '75%', height: 120, background: scene.hillColor2 }} />
              <div className="postcard-hill" style={{ bottom: -52, right: '-14%', width: '78%', height: 130, background: scene.hillColor }} />
            </>
          )}

          {scene.hasFlowers && (
            <>
              <span className="postcard-flower" style={{ bottom: 12, left: '18%', width: 8, height: 8, background: scene.flowerColor }} />
              <span className="postcard-flower" style={{ bottom: 22, left: '44%', width: 7, height: 7, background: '#FFF3B0' }} />
              <span className="postcard-flower" style={{ bottom: 9, left: '70%', width: 8, height: 8, background: scene.flowerColor }} />
            </>
          )}

          <div className="postcard-stamp">
            <div className="postcard-stamp-emoji">{scene.emoji}</div>
            <div className="postcard-stamp-label">YOUR LETTER</div>
          </div>

          <div className="postcard-scene-pill">
            <span>{scene.emoji}</span>
            <span>{scene.name}</span>
          </div>
        </div>

        <div className="postcard-note">
          <div className="postcard-greeting">{greeting}</div>
          <p className="postcard-message">{message}</p>

          <div className="postcard-quote-box">
            <div className="postcard-quote-text">&ldquo;{quoteText}&rdquo;</div>
            {quoteAuthor && <div className="postcard-quote-author">— {quoteAuthor}</div>}
          </div>

          <div className="postcard-sender">— {sender}</div>
        </div>
      </div>
    </div>
  );
}
