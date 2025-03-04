import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

const transactions = [
  {
    id: 1,
    name: "Alex",
    email: "alex@dashwind.com",
    avatar: "/placeholder.svg?height=40&width=40",
    location: "Paris",
    amount: 100,
    date: "25 Feb",
    status: "success",
  },
  {
    id: 2,
    name: "Ereena",
    email: "ereena@dashwind.com",
    avatar: "/placeholder.svg?height=40&width=40",
    location: "London",
    amount: 190,
    date: "24 Feb",
    status: "waiting",
  },
  {
    id: 3,
    name: "John",
    email: "jhon@dashwind.com",
    avatar: "/placeholder.svg?height=40&width=40",
    location: "Canada",
    amount: 112,
    date: "24 Feb",
    status: "failure",
  },
  {
    id: 4,
    name: "Matrix",
    email: "matrix@dashwind.com",
    avatar: "/placeholder.svg?height=40&width=40",
    location: "Peru",
    amount: 111,
    date: "24 Feb",
    status: "success",
  },
  {
    id: 5,
    name: "Virat",
    email: "virat@dashwind.com",
    avatar: "/placeholder.svg?height=40&width=40",
    location: "London",
    amount: 190,
    date: "23 Feb",
    status: "waiting",
  },
];
export default function TransactionsPage() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // filter action transactions
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesFilter =
      selectedFilter === "all" || transaction.status === selectedFilter;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      transaction.name.toLowerCase().includes(searchLower) ||
      transaction.email.toLowerCase().includes(searchLower) ||
      transaction.location.toLowerCase().includes(searchLower);

    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "success":
        return "bg-green-500/20 text-green-500";
      case "failure":
        return "bg-red-500/20 text-red-500";
      case "waiting":
        return "bg-yellow-500/20 text-yellow-500";
      default:
        return "bg-gray-500/20 text-gray-500";
    }
  };

  return (
    <Box className="min-h-screen  p-8">
      <Box className="mx-auto max-w-7xl">
        <Box className="rounded-lg bg-slate-900 p-6">
          {/* Header */}
          <Box className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Typography className="text-xl font-semibold text-white">
              Recent Transactions
            </Typography>
            <Box className="flex flex-col gap-2 sm:flex-row sm:items-center">
              {/* Search Input */}
              <Box className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-10 rounded-md border border-slate-700 bg-slate-800 pl-10 pr-4 text-sm text-white placeholder-slate-400 focus:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-600"
                />
                <SearchIcon className="absolute left-3 top-2 h-4 w-4 text-slate-400"></SearchIcon>
              </Box>

              {/* Filter Dropdown */}
              <Box className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex h-10 items-center gap-2 rounded-md border border-slate-700 bg-slate-800 px-4 text-sm text-white hover:bg-slate-700"
                >
                  <FilterAltIcon className="h-4 w-4"></FilterAltIcon>
                  Filter
                </button>
                {isDropdownOpen && (
                  <Box className="absolute right-0 z-10 mt-2 w-48 rounded-md border border-slate-700 bg-slate-800 py-1 shadow-lg">
                    <button
                      onClick={() => {
                        setSelectedFilter("all");
                        setIsDropdownOpen(false);
                      }}
                      className="block w-full px-4 py-2 text-left text-sm text-white hover:bg-slate-700"
                    >
                      All
                    </button>
                    <button
                      onClick={() => {
                        setSelectedFilter("success");
                        setIsDropdownOpen(false);
                      }}
                      className="block w-full px-4 py-2 text-left text-sm text-white hover:bg-slate-700"
                    >
                      Success
                    </button>
                    <button
                      onClick={() => {
                        setSelectedFilter("failure");
                        setIsDropdownOpen(false);
                      }}
                      className="block w-full px-4 py-2 text-left text-sm text-white hover:bg-slate-700"
                    >
                      Failure
                    </button>
                    <button
                      onClick={() => {
                        setSelectedFilter("waiting");
                        setIsDropdownOpen(false);
                      }}
                      className="block w-full px-4 py-2 text-left text-sm text-white hover:bg-slate-700"
                    >
                      Waiting
                    </button>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>

          {/* Table */}
          <Box className="overflow-x-auto">
            <Table className="w-full border-collapse">
              <TableHead>
                <TableRow className="border-b border-slate-700">
                  <TableCell
                    className="px-4 py-5 text-left text-sm font-medium "
                    sx={{ color: "white" }}
                  >
                    Name
                  </TableCell>
                  <TableCell
                    className="px-4 py-5 text-left text-sm font-medium "
                    sx={{ color: "white" }}
                  >
                    Email Id
                  </TableCell>
                  <TableCell
                    className="px-4 py-5 text-left text-sm font-medium "
                    sx={{ color: "white" }}
                  >
                    Location
                  </TableCell>
                  <TableCell
                    className="px-4 py-5 text-left text-sm font-medium "
                    sx={{ color: "white" }}
                  >
                    Amount
                  </TableCell>
                  <TableCell
                    className="px-4 py-5 text-left text-sm font-medium "
                    sx={{ color: "white" }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    className="px-4 py-5 text-left text-sm font-medium "
                    sx={{ color: "white" }}
                  >
                    Transaction Date
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow
                    key={transaction.id}
                    className="border-b border-slate-700 hover:bg-slate-800"
                  >
                    <TableCell
                      className="px-4 py-10"
                      sx={{ padding: "2.5rem" }}
                    >
                      <Box className="flex items-center gap-3">
                        <img
                          src={transaction.avatar || "/placeholder.svg"}
                          alt={transaction.name}
                          className="h-8 w-8 rounded-full"
                        />
                        <Typography
                          className="text-sm font-medium text-white"
                          sx={{ color: "white" }}
                        >
                          {transaction.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell
                      className="px-4 py-5 text-sm text-slate-300"
                      sx={{ color: "white" }}
                    >
                      {transaction.email}
                    </TableCell>
                    <TableCell
                      className="px-4 py-5 text-sm text-slate-300"
                      sx={{ color: "white" }}
                    >
                      {transaction.location}
                    </TableCell>
                    <TableCell
                      className="px-4 py-5 text-sm text-slate-300"
                      sx={{ color: "white" }}
                    >
                      ${transaction.amount}
                    </TableCell>
                    <TableCell className="px-4 py-5">
                      <Typography
                        className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                          transaction.status
                        )}`}
                      >
                        {transaction.status.charAt(0).toUpperCase() +
                          transaction.status.slice(1)}
                      </Typography>
                    </TableCell>
                    <TableCell
                      className="px-4 py-5 text-sm text-slate-300"
                      sx={{ color: "white" }}
                    >
                      {transaction.date}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
