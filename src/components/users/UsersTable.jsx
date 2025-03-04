import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { getUpgradeRequestsApi } from "../../stores/slices/authSlice";
import { approveRequest, rejectRequest } from "../../stores/slices/requestUpgradeSlice";

const UsersTable = () => {
	const dispatch = useDispatch();
	const { upgradeRequests, isLoading, error } = useSelector((state) => state.auth);
	const [searchTerm, setSearchTerm] = useState("");
	const [shouldRefresh, setShouldRefresh] = useState(false);

	// Fetch upgrade requests from Redux store
	useEffect(() => {
		if (!upgradeRequests || (Array.isArray(upgradeRequests) && upgradeRequests.length === 0)) {
			dispatch(getUpgradeRequestsApi());
		}
	}, [dispatch, upgradeRequests]);

	// Handle search input
	const handleSearch = (e) => {
		setSearchTerm(e.target.value.toLowerCase());
	};

	useEffect(() => {
		if (shouldRefresh) {
			window.location.reload();
			setShouldRefresh(false);
		}
	}, [shouldRefresh]);

	const handleApprove = async (requestId) => {
		try {
			await dispatch(approveRequest(requestId));
			setShouldRefresh(true);
		} catch (error) {
			console.error("Error approving request:", error);
		}
	};

	const handleReject = async (requestId) => {
		try {
			await dispatch(rejectRequest(requestId));
			setShouldRefresh(true);
		} catch (error) {
			console.error("Error rejecting request:", error);
		}
	};

	return (
		<motion.div
			className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-xl font-semibold text-gray-100">Upgrade Requests</h2>
				<div className="relative">
					<input
						type="text"
						placeholder="Search requests..."
						className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						value={searchTerm}
						onChange={handleSearch}
					/>
					<Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
				</div>
			</div>

			<div className="overflow-x-auto">
				{isLoading ? (
					<p className="text-gray-400 text-center">Loading...</p>
				) : error ? (
					<p className="text-red-400 text-center">Error: {error}</p>
				) : (
					<table className="min-w-full divide-y divide-gray-700">
						<thead>
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									Tutor Name
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									Requested On
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									Actions
								</th>
							</tr>
						</thead>

						<tbody className="divide-y divide-gray-700">
							{Array.isArray(upgradeRequests) && upgradeRequests.length > 0 ? (
								upgradeRequests.map((request) => (
									<motion.tr key={request.id}>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm font-medium text-gray-100">{request.fullName}</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm text-gray-300">{new Date(request.requestedAt).toLocaleDateString()}</div>
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
											<button 
												className="text-green-400 hover:text-green-300 mr-2" 
												onClick={() => handleApprove(request.id)}
											>
												Approve
											</button>
											<button 
												className="text-red-400 hover:text-red-300" 
												onClick={() => handleReject(request.id)}
											>
												Reject
											</button>
										</td>
									</motion.tr>
								))
							) : (
								<tr>
									<td colSpan="3" className="text-center py-4 text-gray-400">
										No upgrade requests found.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				)}
			</div>
		</motion.div>
	);
};

export default UsersTable;