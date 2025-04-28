"use client"
import "./Card.css"

function Card({ title, interest, description, buttonText, onButtonClick }) {
  return (
    <div className="card">
      <h3 className="card-title">{title}</h3>
      <div className="card-interest">{interest}% Interest</div>
      <p className="card-description">{description}</p>
      {buttonText && (
        <button className="card-button" onClick={onButtonClick}>
          {buttonText}
        </button>
      )}
    </div>
  )
}

export default Card
