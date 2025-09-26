import React, { useState } from "react";
import { Link } from "react-router-dom";

const navItems = [
	{
		label: "Shop by Category",
		dropdown: [
			{ label: "Gold Jewellery", to: "/shop/gold" },
			{ label: "Silver Jewellery", to: "/shop/silver" },
			{ label: "Diamond Jewellery", to: "/shop/diamond" },
			{ label: "Platinum Jewellery", to: "/shop/platinum" },
		],
	},
	{
		label: "Customization Gifts",
		dropdown: [
			{ label: "Engraved Jewellery", to: "/customization/engraved" },
			{ label: "Photo Jewellery", to: "/customization/photo" },
			{ label: "Name Jewellery", to: "/customization/name" },
		],
	},
	{
		label: "Gift Card",
		dropdown: [
			{ label: "Buy Gift Card", to: "/gift-card/buy" },
			{ label: "Redeem Gift Card", to: "/gift-card/redeem" },
		],
	},
	{
		label: "Latest Collection",
		dropdown: [
			{ label: "New Arrivals", to: "/latest/new-arrivals" },
			{ label: "Trending", to: "/latest/trending" },
			{ label: "Best Sellers", to: "/latest/best-sellers" },
		],
	},
	{
		label: "Men Jewellery",
		dropdown: [
			{ label: "Chains", to: "/men/chains" },
			{ label: "Bracelets", to: "/men/bracelets" },
			{ label: "Rings", to: "/men/rings" },
			{ label: "Cufflinks", to: "/men/cufflinks" },
		],
	},
	{
		label: "Women Jewellery",
		dropdown: [
			{ label: "Necklaces", to: "/women/necklaces" },
			{ label: "Earrings", to: "/women/earrings" },
			{ label: "Bracelets", to: "/women/bracelets" },
			{ label: "Rings", to: "/women/rings" },
			{ label: "Anklets", to: "/women/anklets" },
		],
	},
  {
		label: "Wedding Collections",
		dropdown: [
			{ label: "Necklaces", to: "/wedding/necklaces" },
			{ label: "Earrings", to: "/wedding/earrings" },
			{ label: "Bracelets", to: "/wedding/bracelets" },
			{ label: "Rings", to: "/wedding/rings" },
			{ label: "Anklets", to: "/wedding/anklets" },
		],
	},
];

const Navbar2 = () => {
const [openIndex, setOpenIndex] = useState(null);
return (
<nav className="w-full bg-white shadow hidden md:block">
<div className="px-2 sm:px-[2vw] md:px-[2vw] lg:px-[2vw] xl:px-[4vw] flex items-center h-16 md:h-12 lg:h-12 xl:h-16">
<ul className="flex gap-8 md:gap-4 lg:gap-4 xl:gap-8 text-base md:text-xs lg:text-xs xl:text-base">
					{navItems.map((item, idx) => (
						<li
							key={item.label}
							className="relative"
							onMouseEnter={() => setOpenIndex(idx)}
							onMouseLeave={() => setOpenIndex(null)}
						>
							<button className="flex items-center text-gray-700 font-medium hover:underline decoration-pink-500 underline-offset-4 md:text-xs lg:text-xs xl:text-base">
								{item.label}
								{/* Arrow rotates on hover */}
								<span className={`inline-block ml-2 transition-transform duration-300 ${openIndex === idx ? "rotate-180" : ""}`}>
									<svg width="16" height="16" fill="none" viewBox="0 0 24 24">
										<path
											d="M7 10l5 5 5-5"
											stroke="#d6336c"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</span>
							</button>
											{openIndex === idx && (
												<div
													className="absolute left-0 top-full min-w-[140px] md:min-w-[120px] lg:min-w-[120px] xl:min-w-[180px] bg-white shadow-lg rounded z-50 pointer-events-auto mt-0"
													onMouseEnter={() => setOpenIndex(idx)}
													onMouseLeave={() => setOpenIndex(null)}
												>
													{item.dropdown.map((drop) => (
														<Link
															key={drop.label}
															to={drop.to}
															className="block px-4 py-2 text-gray-600 hover:bg-pink-100 hover:text-pink-700 hover:underline underline-offset-4 transition-colors md:text-xs lg:text-xs xl:text-base"
														>
															{drop.label}
														</Link>
													))}
												</div>
											)}
						</li>
					))}
				</ul>
			</div>
		</nav>
	);
};

export default Navbar2;