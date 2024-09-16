import React, { useEffect, useState } from 'react';
import { DataTable, DataTableStateEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { fetchArtworks } from '../api/artApi';
import { Artwork } from '../types/artTypes';
import './../index.css';

const ArtTable: React.FC = () => {
    const [artworks, setArtworks] = useState<Artwork[]>([]);
    const [selectedArtworks, setSelectedArtworks] = useState<Artwork[]>([]);
    const [globalSelectedRows, setGlobalSelectedRows] = useState<Artwork[]>([]); // To persist selection across pages
    const [page, setPage] = useState<number>(1);
    const totalRecords = 100; // Set static total record count

    useEffect(() => {
        loadArtworks(page);
    }, [page]);

    const loadArtworks = async (pageNumber: number) => {
        const data = await fetchArtworks(pageNumber);
        setArtworks(data);
    };

    // Handle selection changes and merge with global selections
    const onRowSelectChange = (e: { value: Artwork[] }) => {
        setSelectedArtworks(e.value);
        setGlobalSelectedRows((prevSelected) => {
            // Update global selected rows to persist across pages
            const updatedSelection = [...prevSelected.filter((item) => !artworks.some((a) => a.id === item.id)), ...e.value];
            return updatedSelection;
        });
    };

    // Custom panel logic to display selected items
    const renderSelectionPanel = () => {
        return (
            <div className="custom-selection-panel">
                <textarea
                    value={globalSelectedRows.map(row => row.title).join(', ')}
                    placeholder="Select rows..."
                    readOnly
                />
                <button onClick={handleSubmit}>Submit</button>
            </div>
        );
    };

    // Handle submission of selected rows
    const handleSubmit = () => {
        console.log('Submitted selected rows:', globalSelectedRows);
    };

    const onPageChange = (event: DataTableStateEvent) => {
        setPage((event.page ?? 0) + 1);
    };

    return (
        <div className="art-table">
            {globalSelectedRows.length > 0 && renderSelectionPanel()}
            <DataTable
                value={artworks}
                paginator
                rows={5}
                selectionMode="checkbox"
                selection={selectedArtworks}
                onSelectionChange={onRowSelectChange}
                onPage={onPageChange}
                totalRecords={totalRecords}
                lazy
            >
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                <Column field="title" header="Title"></Column>
                <Column field="place_of_origin" header="Origin"></Column>
                <Column field="artist_display" header="Artist"></Column>
                <Column field="inscriptions" header="Inscriptions"></Column>
                <Column field="date_start" header="Start Date"></Column>
                <Column field="date_end" header="End Date"></Column>
            </DataTable>
        </div>
    );
};

export default ArtTable;
