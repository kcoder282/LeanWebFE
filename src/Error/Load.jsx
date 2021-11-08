import './Load.css';

export default function Load() {
    return (
      <div className="load-container w-100 d-flex justify-content-center align-items-center">
        <div className="loader">
            <div style={{ "--delay": "0s" }} />
            <div style={{ "--delay": ".2s" }} />
            <div style={{ "--delay": ".4s" }} />
            <div style={{ "--delay": ".6s" }} />
            <div style={{ "--delay": ".8s" }} />
        </div>
      </div>
    );
}
