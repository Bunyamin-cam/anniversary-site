import { Icon } from "./Icons";
export default function HeadphoneIntro({ onReady }: { onReady: () => void }) {
  return <section className="screen headphone-screen" aria-labelledby="headphone-title">
    <p className="eyebrow">BAŞLAMADAN ÖNCE</p>
    <div className="headphone-orbit"><span /><span /><Icon name="headphones" width="64" height="64" /></div>
    <h1 id="headphone-title" tabIndex={-1} data-screen-heading>Kulaklığını <em>tak.</em></h1>
    <p className="description">Bundan sonrası bizim hikâyemiz.</p>
    <button className="primary-button ready-button" onClick={onReady}>Hazırım <Icon name="arrow" /></button>
    <p className="quiet-note">Biraz müzik. Birkaç anı. Ve biz.</p>
  </section>;
}
