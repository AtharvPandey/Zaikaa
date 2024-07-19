import React from "react";
import "./Offers.css"; // Import the CSS file

const offers = [
  {
    title: "Exclusive Deal Just for You!",
    text: "Get an amazing offer on our new menu items. Hurry, this deal won’t last long!",
    discount: "30%",
  },
  {
    title: "Limited Time Offer!",
    text: "Enjoy a special discount on all our bestsellers. Don’t miss out!",
    discount: "25%",
  },
  {
    title: "Seasonal Special!",
    text: "Relish our seasonal dishes at a great price. Order now before it’s gone!",
    discount: "35%",
  },
  {
    title: "Daily Deal!",
    text: "Grab today’s offer and enjoy a delicious meal with a fantastic discount!",
    discount: "20%",
  },
];

const Offer = () => {
  return (
    <div className="offers-container">
      {offers.map((offer, index) => (
        <div className="card-hover" key={index}>
          <h2>Hello Kimmi</h2>
          <div className="card-hover__content">
            <h3 className="card-hover__title">{offer.title}</h3>
            <p className="card-hover__text">{offer.text}</p>
            <a href="#" className="card-hover__link">
              <span>Learn How</span>
              <svg
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </a>
          </div>
          <div className="card-hover__extra">
            <h4>
              Learn <span>now</span> and get <span>{offer.discount}</span>{" "}
              discount!
            </h4>
          </div>
          <img
            src="https://images.unsplash.com/photo-1586511925558-a4c6376fe65f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=60"
            alt="Offer"
          />
        </div>
      ))}
    </div>
  );
};

export default Offer;
