import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

// Updated categories with new items and images
const categories = [
	{
		label: "Pendants",
		img: "https://www.giva.co/cdn/shop/collections/pink_necklaces_pend_copy.jpg?v=1754993321",
	},
	{
		label: "Personalised",
		img: "https://www.giva.co/cdn/shop/collections/Personaloised_250_x_250-min.png?v=1754993394",
	},
	{
		label: "Earrings",
		img: "https://www.giva.co/cdn/shop/collections/earrings_pink-min.png?v=1754993425",
	},
	{
		label: "Rings",
		img: "https://www.giva.co/cdn/shop/collections/pink_rings_c356f6b3-6547-4e39-9b08-dfdf5ecfc2b0.jpg?v=1754993145",
	},
	{
		label: "Bracelets",
		img: "https://www.giva.co/cdn/shop/collections/pink_br-min.png?v=1754993016",
	},
	{
		label: "Anklets",
		img: "https://www.giva.co/cdn/shop/collections/anklets_f99dfe60-fc81-457a-ab33-721352c6e672.jpg?v=1754993072",
	},
	{
		label: "Sets",
		img: "https://www.giva.co/cdn/shop/collections/sets_pink.webp?v=1754993102",
	},
	{
		label: "Men's",
		img: "https://www.giva.co/cdn/shop/collections/Frame_2609057-min.jpg?v=1754993215",
	},
	{
		label: "Mangalsutras",
		img: "https://www.giva.co/cdn/shop/collections/Mangalsutras_3.jpg?v=1754992933",
	},
	{
		label: "Silver Chains",
		img: "https://www.giva.co/cdn/shop/collections/pink_necklaces_pend_copy.jpg?v=1754993321",
	},
	{
		label: "Nose Pins",
		img: "https://www.giva.co/cdn/shop/collections/pink_necklaces_pend_copy.jpg?v=1754993321",
	},
	{
		label: "Toe Rings",
		img: "https://www.giva.co/cdn/shop/collections/pink_necklaces_pend_copy.jpg?v=1754993321",
	},
];

const LatestCollection = () => {
	const { products } = useContext(ShopContext);
	const [latestProducts, setLatestProducts] = useState([]);

	useEffect(() => {
		setLatestProducts(products.slice(0, 10));
	}, [products]);

	return (
		<div className="my-10">
			<div className="text-center py-8 text-3xl">
				<Title text1="LATEST" text2="COLLECTION" />
			</div>
			{/* Scrollable CategoryBar */}
			<div className="w-full py-6 bg-white">
				<div className="flex overflow-x-auto gap-8 scrollbar-thin scrollbar-thumb-pink-200 scrollbar-track-transparent">
					{categories.map((cat) => (
						<div
							key={cat.label}
							className="flex flex-col items-center min-w-[120px]"
						>
							<div className="w-[110px] h-[110px] rounded-[28px] overflow-hidden border border-pink-200 flex items-center justify-center bg-pink-50 hover:shadow-lg transition-shadow">
								<img
									src={cat.img}
									alt={cat.label}
									className="object-cover w-full h-full"
								/>
							</div>
							<span className="mt-3 text-lg text-black font-normal">
								{cat.label}
							</span>
						</div>
					))}
				</div>
			</div>
			{/* Rendering Products */}
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
				{latestProducts.map((item, index) => (
					<ProductItem
						id={item._id}
						image={item.image}
						name={item.name}
						price={item.price}
						key={index}
					/>
				))}
			</div>
		</div>
	);
};

export default LatestCollection;
