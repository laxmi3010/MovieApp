import { PiTelevisionSimpleBold } from "react-icons/pi";
import { IoMdHome } from "react-icons/io";
import { BiSolidMoviePlay } from "react-icons/bi";
import { FaSearch } from "react-icons/fa";

export const navigation = [
  {
    label: 'TV Show',
    href: '/explore/tv', 
    icon :  <PiTelevisionSimpleBold/>
  },
  {
    label: 'Movie',
    href: '/explore/movie',  
    icon : <BiSolidMoviePlay/>
  }
];

export const mobilenav = [
  {
    label : "Home",
    href :"/",
    icon : <IoMdHome/>
  },
  ...navigation,
  {
    label : "Search",
    href : "/search",
    icon : <FaSearch/>
  }
]

