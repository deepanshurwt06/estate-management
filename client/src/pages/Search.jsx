import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";

export default function Search() {
  const navigate = useNavigate();
  const [sideBarData, setSideBarData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    sort: "createdAt",
    offer: false,
    order: "desc",
  });
  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const sortFromUrl = urlParams.get("sort");
    const offerFromUrl = urlParams.get("offer");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      sortFromUrl ||
      offerFromUrl ||
      orderFromUrl
    ) {
      setSideBarData({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "createdAt",
        order: orderFromUrl || "desc",
      });
    }

    const fetchListing = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      }
      setListing(data);
      setLoading(false);
    };
    fetchListing();
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSideBarData({
        ...sideBarData,
        type: e.target.id,
      });
    }

    if (e.target.id === "searchTerm") {
      setSideBarData({ ...sideBarData, searchTerm: e.target.value });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSideBarData({
        ...sideBarData,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("-")[0] || "createdAt";
      const order = e.target.value.split("-")[1] || "desc";
      setSideBarData({ ...sideBarData, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sideBarData.searchTerm);
    urlParams.set("type", sideBarData.type);
    urlParams.set("parking", sideBarData.parking);
    urlParams.set("furnished", sideBarData.furnished);
    urlParams.set("offer", sideBarData.offer);
    urlParams.set("sort", sideBarData.sort);
    urlParams.set("order", sideBarData.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  //   setLoading(true);
  //   setShowMore(false);

  //   const numberOfListing = listing.length;
  //   const startIndex = numberOfListing;
  //   const urlParams = new URLSearchParams(location.search);
  //   urlParams.set("startIndex", startIndex);
  //   const searchQuery = urlParams.toString();

  //   const res = await fetch(`/api/listing/get?${searchQuery}`);

  //   const data = await res.json();
  //   console.log("Fetched data:", data)
  //   if(data.length < 9){
  //       setShowMore(false);
  //   }

  //   else{
  //     setShowMore(false);
  //   }
  //   setListing([...listing, ...data]);
  //  };

  const onShowMoreClick = async () => {
    setLoading(true);
    setShowMore(false);

    const numberOfListing = listing.length;
    const startIndex = numberOfListing;

    const urlParams = new URLSearchParams(location.search);

    // 🔧 FIXED: make sure the query param matches backend (was "start", now using "startIndex")
    urlParams.set("startIndex", startIndex);

    const searchQuery = urlParams.toString();

    try {
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();

      console.log("Fetched data:", data);

      // 🔧 You can optionally filter duplicates here
      // Prevent adding duplicates just in case
      const existingIds = new Set(listing.map((item) => item._id));
      const newUniqueData = data.filter((item) => !existingIds.has(item._id));

      // 🔧 Only show "Show More" if we got a full page of results
      if (newUniqueData.length < 9) {
        setShowMore(false);
      } else {
        setShowMore(true); // 🔧 If more data might be available
      }

      setListing((prev) => [...prev, ...newUniqueData]);
    } catch (error) {
      console.error("Failed to fetch more listings:", error);
      setShowMore(true); // 🔧 Let user try again if fetch fails
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7  border-zinc-400  border-b-2 sm:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-3 ">
            <label className="whitespace-nowrap font-semibold">
              Search Term :{" "}
            </label>
            <input
              type=" text"
              id="searchTerm"
              placeholder="Search..."
              className="border-2 border-zinc-500 outline-none rounded-lg p-3 w-full bg-slate-200"
              value={sideBarData.searchTerm}
              onChange={handleChange}
            />
          </div>

          <div className="flex gap-6 flex-wrap items-center ">
            <label className="font-semibold ">Type :</label>
            <div className=" flex gap-2 flex-wrap">
              <input
                type="checkbox"
                id="all"
                className="w-5"
                onChange={handleChange}
                checked={sideBarData.type === "all"}
              />
              <span>Rent & Sale</span>
            </div>
            <div className=" flex gap-2 ">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={sideBarData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className=" flex gap-2 ">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                checked={sideBarData.type === "sale"}
                onChange={handleChange}
              />
              <span> Sale</span>
            </div>
            <div className=" flex gap-2 ">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={sideBarData.offer}
              />
              <span>Offer</span>
            </div>
          </div>

          <div className="flex gap-6 fex-wrap items-center">
            <label className="font-semibold">Amenities :</label>
            <div className=" flex gap-2 ">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={sideBarData.parking}
              />
              <span>Parking </span>
            </div>
            <div className=" flex gap-2 ">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={sideBarData.furnished}
              />
              <span>Furnished</span>
            </div>
          </div>

          <div className="flex items-center gap-4 ">
            <label className="font-semibold">Sort :</label>
            <select
              id="sort_order"
              className="border border-zinc-500 rounded-md p-1 outline-none bg-slate-200"
              onChange={handleChange}
              defaultValue={"created_at_desc"}
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button className="bg-slate-700 text-white p-3 uppercase rounded-lg">
            Search
          </button>
        </form>
      </div>

      <div className="flex-1 ">
        <h1 className="text-3xl font-semibold text-zinc-800  border-b-1 border-zinc-400 p-3 mt-5">
          Listing result :{" "}
        </h1>

        <div className="p-7 flex flex-wrap gap-7 sm:justify-center">
          {!loading && listing.length === 0 && (
            <p className="text-lg  text-slate-700">No listing found</p>
          )}
          

          {!loading &&
            listing &&
            listing.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}

          {loading ? (
            <div className="flex justify-center items-center pt-7">
              <div className="loader" />
            </div>
          ) : (
            showMore && (
              <button
                onClick={onShowMoreClick}
                className="text-green-700 hover:underline pt-7 text-center w-full"
              >
                Show More
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
