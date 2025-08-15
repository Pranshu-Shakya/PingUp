import React from "react";
import { dummyPostsData } from "../assets/assets";
import Loading from "../components/Loading";
import StoriesBar from "../components/StoriesBar";
import PostCart from "../components/PostCart";

const Feed = () => {
	const [feeds, setFeeds] = React.useState([]);
	const [loading, setLoading] = React.useState(true);
	const fetchFeeds = async () => {
		setFeeds(dummyPostsData);
        setLoading(false)
	};
	React.useEffect(() => {
		fetchFeeds();
	}, []);
	return !loading ? (
		<div className="h-full overflow-y-scroll no-scrollbar py-10 xl:pr-5 flex items-start justify-center xl:gap-8">
			<div>
                <StoriesBar />
                <div className="p-4 space-y-6">
                    {feeds.map((post) => (<PostCart key={post._id} post={post} />))}
                </div>
            </div>
            <div>
                <div><h1>Sponsored</h1></div>
                <h1>Recent Messages</h1>
            </div>
		</div>
	) : (
		<Loading />
	);
};

export default Feed;
