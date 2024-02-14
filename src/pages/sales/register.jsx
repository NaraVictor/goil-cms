import { Badge, Box, LoadingOverlay, Menu, Modal, Paper } from "@mantine/core";
import { DataGrid } from "@mui/x-data-grid";
import { message } from "antd";
import { useState } from "react";
import { useQuery } from "react-query";
import { PageHeader, SearchInput } from "../../components/shared";
import { deleteSequence, getAllOutletRegisters, getAllRegisterSequences, getPayments, putJoinSequence } from "../../helpers/api";
import NewRegisterForm from "./components/new-register";
import { OpenRegisterForm, CloseRegisterForm } from "./components/open-close-register";
import Registers from "./components/registers";
import smalltalk from 'smalltalk';
import lostSVG from '../../static/svg/icons/lost.svg'
import { Chip } from "@mui/material";
import { isRegisterOpen, getRegister as getReg, getUser, refreshToken } from "../../helpers/auth";



const columns = ( onClose, onOpen, onDelete, onJoin ) => [

    {
        field: 'reg',
        headerName: 'Register',
        sortable: true,
        width: 150,
        renderCell: ( { row } ) => row?.register?.register_name || 'N/A'
    },
    {
        field: 'sequence_name',
        headerName: 'Sequence',
        sortable: true,
        width: 130,
    },
    {
        field: 'open_time',
        headerName: 'Open Time',
        sortable: true,
        width: 230,
        valueFormatter: ( { value } ) => value ? new Date( value ).toUTCString() : 'N/A'
    },
    {
        field: 'close_time',
        headerName: 'Close Time',
        sortable: true,
        width: 230,
        valueFormatter: ( { value } ) => value ? new Date( value ).toUTCString() : 'N/A'
    },
    {
        field: 'opening_float',
        headerName: 'Float',
        sortable: true,
        width: 100,
    },
    // {
    //     field: 'user',
    //     headerName: 'User',
    //     sortable: true,
    //     width: 130,
    // },
    {
        field: 'is_closed',
        headerName: 'Status',
        sortable: true,
        // width: 120,
        flex: 1,
        renderCell: ( { value } ) =>
            value ?
                <Badge color="red">
                    <span className="bi bi-stop-circle me-2"></span>
                    Closed
                </Badge> :
                <Badge color="green">
                    <span className="bi bi-play-circle me-2"></span>
                    Open
                </Badge>

    },

    {
        // headerName: 'Actions',
        width: 50,
        renderCell: ( { row } ) => {
            return (
                <div className="d-flex">
                    <Menu>
                        <Menu.Target>
                            <button className="button is-small is-ghost px-2">
                                <span className="bi bi-list me-2"></span>
                                {/* Actions */ }
                            </button>
                        </Menu.Target>
                        <Menu.Dropdown>
                            {
                                !row.is_closed &&
                                <>
                                    {
                                        getUser()?.register?.sequence_id !== row.id &&
                                        <Menu.Item
                                            onClick={ () => onJoin( row.id ) }
                                            icon={ <span className="bi bi-box-arrow-in-right" /> }>
                                            Join
                                        </Menu.Item>
                                    }
                                    <Menu.Item
                                        onClick={ () => onClose( row.id ) }
                                        color="orange"
                                        icon={ <span className="bi bi-stop-circle" /> }>
                                        Close
                                        {/* use <CloseRegisterForm /> */ }
                                    </Menu.Item>
                                </>
                            }

                            {
                                row.is_closed &&
                                <>
                                    <Menu.Item
                                        onClick={ () => onOpen( row.id ) }
                                        icon={ <span className="bi bi-arrow-up-right-square" /> }>
                                        Open
                                    </Menu.Item>
                                    {/* <Menu.Item
                                        onClick={ () => onOpen( row.id ) }
                                        icon={ <span className="bi bi-bag" /> }>
                                        Sales
                                    </Menu.Item> */}
                                </>
                            }
                            {
                                row.is_closed &&
                                <Menu.Item
                                    color="red"
                                    onClick={ () => onDelete( row.id ) }
                                    icon={ <span className="bi bi-trash" /> }>
                                    Delete
                                    {/* higher permission */ }
                                </Menu.Item>
                            }
                        </Menu.Dropdown>
                    </Menu>
                </div>
            )
        }
    }
];




const RegistersPage = ( props ) => {
    const [ filteredData, setFilteredData ] = useState( [] );
    const [ showLoarder, setSL ] = useState( false )

    const [ modal, setModal ] = useState( {
        isOpen: false,
        title: '',
        content: null,
        size: "md",
        zIndex: 95
    } )
    const [ mode, setMode ] = useState( {
        new: false,
        edit: false,
        id: null
    } )

    // queries
    const { data: sequences = [], isFetching, refetch } = useQuery( {
        queryFn: () => getAllOutletRegisters( getUser()?.outlet_id, 'sequences' ),
        queryKey: [ 'outlet_sequences' ],
        onSuccess: data => setFilteredData( data ),
    } );

    const handleClose = ( id ) => setMode( { edit: true, id } )
    const handleOpen = ( id ) => setMode( { edit: true, id } )
    const handleJoin = ( id ) => {
        setSL( true )

        putJoinSequence( id ).then( res => {
            if ( res.status === 200 ) {
                refreshToken().then( () => {
                    setSL( false )
                    // window.location.reload()
                } )
            }
        } )
    }


    const handleDelete = ( id ) =>
        smalltalk.confirm(
            "Delete Sequence", "This action cannot be undone. Do you wish to continue?", {
            buttons: {
                ok: 'YES',
                cancel: 'NO',
            },
        }
        ).then( go => {
            deleteSequence( id ).then( () => {
                message.success( 'Register Sequence deleted successfully' )
                refetch()
            }
            )
        } ).catch( ex => {
            return false;
        } );



    return (
        <section className="mt-4 pb-4">
            <Modal
                onClose={ () => setModal( { ...modal, isOpen: false } ) }
                opened={ modal.isOpen }
                title={ modal.title }
                size={ modal.size }
                zIndex={ modal.zIndex }
            >
                { modal.content }
            </Modal>
            <LoadingOverlay visible={ showLoarder } />
            {
                mode.new ?
                    <Paper>
                        <OpenRegisterForm
                            onClose={ () => setMode( { edit: false, id: null } ) }
                            onUpdate={ refetch } />
                    </Paper> :
                    mode.edit ?
                        <Paper>
                            <CloseRegisterForm
                                id={ mode.id }
                                onUpdate={ refetch }
                                onClose={ () => setMode( { edit: false, id: null } ) }
                            />
                        </Paper> :
                        <>
                            <PageHeader
                                title="Register Sequences"
                                description="List of all registers sequences (open and closes). Registers control daily sales sessions"
                                metaData={ `${ filteredData.length }` || '...' }
                            />
                            <div className="d-flex justify-content-between">
                                <div className="buttons has-addons">
                                    {
                                        !getReg().sequence_id &&
                                        <button
                                            className="button bokx-btn btn-prim"
                                            onClick={ () => setMode( { new: true } ) }>
                                            <span className="bi bi-play-circle me-2"></span>
                                            Open
                                            <span className="d-none d-md-inline ms-1">
                                                Register
                                            </span>
                                        </button>
                                    }
                                    {
                                        getReg().sequence_id &&
                                        <button
                                            className="button bokx-btn bg-warning"
                                            onClick={ () => setMode( { edit: true, id: getReg()?.sequence_id } ) }
                                        >
                                            <span className="bi bi-stop-circle me-2"></span>
                                            Close
                                            <span className="d-none d-md-inline ms-1">
                                                { getReg().sequence_name }
                                            </span>
                                        </button>
                                    }
                                    <button className="button bokx-btn" onClick={ () => setModal( {
                                        title: 'Registers',
                                        isOpen: true,
                                        content: <Registers />,
                                        size: 'xl',
                                        zIndex: 101
                                    } ) }>
                                        <span className="bi bi-arrow-up-right-circle me-2"></span>
                                        View
                                        <span className="d-none d-md-inline ms-1">
                                            Registers
                                        </span>
                                    </button>
                                    <button className="button bokx-btn" onClick={ () => setModal( {
                                        content: <NewRegisterForm />,
                                        title: "New Register",
                                        isOpen: true
                                    } ) }>
                                        <span className="bi bi-plus-circle me-2"></span>
                                        Add
                                        <span className="d-none d-md-inline ms-1">
                                            Register
                                        </span>
                                    </button>
                                </div>
                                <SearchInput
                                    className="d-none d-md-inline"
                                    placeholder="find by register, sequence or float"
                                    onChange={ value =>
                                        setFilteredData(
                                            sequences.filter( fd =>
                                                fd.sequence_name.toLowerCase().includes( value.toLowerCase() ) ||
                                                fd.opening_float.toString().toLowerCase().includes( value.toLowerCase() ) ||
                                                // fd.open_time.toString().toLowerCase().includes( value.toLowerCase() ) ||
                                                fd.register?.register_name.toLowerCase().includes( value.toLowerCase() )
                                            ) )
                                    }
                                />
                            </div>
                            {/* 
                            { isRegisterOpen() ?
                                <> */}
                            <Paper>
                                <Box sx={ { height: 500, width: '100%' } }>
                                    <DataGrid
                                        columns={ columns( handleClose, handleOpen, handleDelete, handleJoin ) }
                                        rows={ filteredData }
                                        loading={ isFetching }
                                    />
                                </Box>
                            </Paper>
                            {/* </> :
                                <div className="p-4 text-center">
                                    <div>
                                        <img src={ lostSVG } alt=""
                                            className="mt-5 pb-3"
                                            height={ 220 }
                                            width={ 220 }
                                        />
                                    </div>
                                    <Chip label="Register Closed" />
                                </div>
                            } */}
                        </>
            }
        </section >
    );
}

export { RegistersPage };