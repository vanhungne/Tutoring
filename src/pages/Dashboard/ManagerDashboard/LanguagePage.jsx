import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllLanguages } from "../../../stores/slices/languageSlice";
import { motion } from "framer-motion";
import StatCard from "../../../components/common/StatCard";
import UsersTable from "../../../components/users/UsersTable";
import { UsersIcon } from "lucide-react";

const LanguagePage = () => {
  const dispatch = useDispatch();
  const { upgradeRequests, isLoading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchAllLanguages());
  }, [dispatch]);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Total Upgrade Requests"
            icon={UsersIcon}
            value={upgradeRequests?.length || 0}
            color="#6366F1"
          />
        </motion.div>

        {/* USERS TABLE */}
        {isLoading ? (
          <p>Loading upgrade requests...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : (
          <UsersTable upgradeRequests={upgradeRequests} />
        )}
      </main>
    </div>
  );
};

export default LanguagePage;
