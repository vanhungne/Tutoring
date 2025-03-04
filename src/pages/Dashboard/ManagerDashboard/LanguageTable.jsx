import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Search, Edit, Trash2, Plus } from "lucide-react";
import { fetchAllLanguages } from "../../../stores/slices/languageSlice";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";

const LanguageTable = () => {
    const dispatch = useDispatch();
    const { languages = [], isLoading, error } = useSelector((state) => state.language || { languages: [] });
    const [searchTerm, setSearchTerm] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState(null);
    const [formData, setFormData] = useState({
        languageName: "",
        description: ""
    });

    useEffect(() => {
        dispatch(fetchAllLanguages());
    }, [dispatch]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const handleOpenDialog = (language = null) => {
        if (language) {
            setSelectedLanguage(language);
            setFormData({
                languageName: language.languageName,
                description: language.description || ""
            });
        } else {
            setSelectedLanguage(null);
            setFormData({
                languageName: "",
                description: ""
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = () => {
        // Here you would dispatch an action to add or update a language
        console.log("Form submitted:", formData);
        // For now, just close the dialog
        handleCloseDialog();
    };

    const filteredLanguages = languages.filter(language =>
        language.languageName.toLowerCase().includes(searchTerm)
    );

    return (
        <motion.div
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-100">Languages</h2>
                <div className="flex gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search languages..."
                            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    </div>
                    <Button
                        variant="contained"
                        startIcon={<Plus size={18} />}
                        onClick={() => handleOpenDialog()}
                        sx={{
                            backgroundColor: "#10B981",
                            "&:hover": {
                                backgroundColor: "#059669"
                            }
                        }}
                    >
                        Add Language
                    </Button>
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
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Username</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                        {filteredLanguages.length > 0 ? (
                            filteredLanguages.map(language => (
                                <tr key={language.languageId}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{language.languageId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{language.languageName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{language.description || "N/A"}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{language.userName || "N/A"}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                        <div className="flex space-x-2">
                                            <button
                                                className="text-blue-400 hover:text-blue-300"
                                                onClick={() => handleOpenDialog(language)}
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button className="text-red-400 hover:text-red-300">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-400">
                                    No languages found
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Add/Edit Language Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{selectedLanguage ? "Edit Language" : "Add New Language"}</DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Language Name"
                            name="languageName"
                            value={formData.languageName}
                            onChange={handleInputChange}
                            required
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            multiline
                            rows={4}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">
                        {selectedLanguage ? "Update" : "Add"}
                    </Button>
                </DialogActions>
            </Dialog>
        </motion.div>
    );
};

export default LanguageTable;