import { BadgeCheck, X } from "lucide-react";
import React, { useEffect } from "react";

const StoryViewer = ({ viewStory, setViewStory }) => {
	const [progress, setProgress] = React.useState(0);

	// Smooth progress for non-video stories using a single CSS transition
	useEffect(() => {
		if (!viewStory) return;

		// Reset progress when story changes
		setProgress(0);

		if (viewStory.media_type !== "video") {
			const duration = 10000; // 10s for image/text stories

			// Kick off the CSS transition on the next frame
			const rafId = requestAnimationFrame(() => setProgress(100));

			// Auto-close after duration
			const timeoutId = setTimeout(() => setViewStory(null), duration);

			return () => {
				cancelAnimationFrame(rafId);
				clearTimeout(timeoutId);
			};
		}

		// For videos, progress can be driven by the <video> element if desired
		return undefined;
	}, [viewStory, setViewStory]);
	const handleClose = () => {
		setViewStory(null);
	};

	if (!viewStory) return null;

	const renderContent = () => {
		switch (viewStory.media_type) {
			case "image":
				return (
					<img
						src={viewStory.media_url}
						className="max-w-full max-h-screen object-contain"
						alt=""
					/>
				);
			case "video":
				return (
					<video
						onEnded={() => setViewStory(null)}
						autoPlay
						controls
						src={viewStory.media_url}
						className="max-w-full max-h-screen object-contain"
					/>
				);
			case "text":
				return (
					<div className="w-full h-full flex items-center justify-center p-8 text-white text-2xl text-center">
						{viewStory.content}
					</div>
				);
			default:
				return null;
		}
	};
	return (
		<div
			className="fixed inset-0 h-screen bg-black bg-opacity-90 z-110 flex items-center justify-center"
			style={{
				backgroundColor:
					viewStory.media_type === "text" ? viewStory.background_color : "#000000",
			}}
		>
			{/* progress bar */}
			<div className="absolute top-0 left-0 w-full h-1 bg-gray-700">
				<div
					className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-[width]"
					style={{
						width: `${progress}%`,
						// Smooth linear animation for non-video stories
						transition:
							viewStory.media_type !== "video" ? "width 10000ms linear" : undefined,
					}}
				></div>
			</div>
			{/* user info - top left */}
			<div className="absolute top-4 left-4 flex items-center space-x-3 p-2 px-4 sm:p-4 sm:px-8 backdrop-blur-2xl rounded bg-black/50">
				<img
					src={viewStory.user?.profile_picture}
					className="size-7 sm:size-8 rounded-full object-cover border border-white"
					alt=""
				/>
				<div className="text-white font-medium flex items-center gap-1.5">
					<span>{viewStory.user?.full_name}</span>
					<BadgeCheck size={18} />
				</div>
			</div>
			{/* close button */}
			<button
				onClick={handleClose}
				className="absolute top-4 right-4 text-white text-3xl font-bold focus:outline-none"
			>
				<X className="w-8 h-8 hover:scale-110 transition cursor-pointer" />
			</button>
			{/* content wrapper */}
			<div className="max-w-[90vw] max-h-[90vh] flex items-center justify-center">
				{renderContent()}
			</div>
		</div>
	);
};

export default StoryViewer;
