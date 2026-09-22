{
    "loadcollection1": {
        "process_id": "load_collection",
        "arguments": {
            "id": "SENTINEL1_GRD_MONTHLY_MOSAIC_IW",
            "spatial_extent": {},
            "temporal_extent": null,
            "bands": [
                "VV",
                "VH"
            ]
        }
    },
    "applydimension1": {
        "process_id": "apply_dimension",
        "arguments": {
            "data": {
                "from_node": "loadcollection1"
            },
            "dimension": "bands",
            "process": {
                "process_graph": {
                    "vv": { "process_id": "array_element", "arguments": { "data": { "from_parameter": "data" }, "index": 0 } },
                    "vh": { "process_id": "array_element", "arguments": { "data": { "from_parameter": "data" }, "index": 1 } },
                    
                    "vv_gain": { "process_id": "multiply", "arguments": { "x": { "from_node": "vv" }, "y": 2.9 } },
                    "vh_gain": { "process_id": "multiply", "arguments": { "x": { "from_node": "vh" }, "y": 16.0 } },
                    "ratio": { "process_id": "divide", "arguments": { "x": { "from_node": "vh" }, "y": { "from_node": "vv" } } },
                    "rat_gain": { "process_id": "multiply", "arguments": { "x": { "from_node": "ratio" }, "y": 1.6 } },

                    "l_vv": { "process_id": "multiply", "arguments": { "x": { "from_node": "vv_gain" }, "y": 0.2126 } },
                    "l_vh": { "process_id": "multiply", "arguments": { "x": { "from_node": "vh_gain" }, "y": 0.7152 } },
                    "l_rat": { "process_id": "multiply", "arguments": { "x": { "from_node": "rat_gain" }, "y": 0.0722 } },
                    "l_sum1": { "process_id": "add", "arguments": { "x": { "from_node": "l_vv" }, "y": { "from_node": "l_vh" } } },
                    "L": { "process_id": "add", "arguments": { "x": { "from_node": "l_sum1" }, "y": { "from_node": "l_rat" } } },

                    "sat_diff_r": { "process_id": "subtract", "arguments": { "x": { "from_node": "vv_gain" }, "y": { "from_node": "L" } } },
                    "sat_mult_r": { "process_id": "multiply", "arguments": { "x": { "from_node": "sat_diff_r" }, "y": 1.2 } },
                    "sat_add_r": { "process_id": "add", "arguments": { "x": { "from_node": "L" }, "y": { "from_node": "sat_mult_r" } } },
                    "sat_r": { "process_id": "max", "arguments": { "data": [ { "from_node": "sat_add_r" }, 0 ] } },

                    "sat_diff_g": { "process_id": "subtract", "arguments": { "x": { "from_node": "vh_gain" }, "y": { "from_node": "L" } } },
                    "sat_mult_g": { "process_id": "multiply", "arguments": { "x": { "from_node": "sat_diff_g" }, "y": 1.2 } },
                    "sat_add_g": { "process_id": "add", "arguments": { "x": { "from_node": "L" }, "y": { "from_node": "sat_mult_g" } } },
                    "sat_g": { "process_id": "max", "arguments": { "data": [ { "from_node": "sat_add_g" }, 0 ] } },

                    "sat_diff_b": { "process_id": "subtract", "arguments": { "x": { "from_node": "rat_gain" }, "y": { "from_node": "L" } } },
                    "sat_mult_b": { "process_id": "multiply", "arguments": { "x": { "from_node": "sat_diff_b" }, "y": 1.2 } },
                    "sat_add_b": { "process_id": "add", "arguments": { "x": { "from_node": "L" }, "y": { "from_node": "sat_mult_b" } } },
                    "sat_b": { "process_id": "max", "arguments": { "data": [ { "from_node": "sat_add_b" }, 0 ] } },

                    "rein_den_r": { "process_id": "add", "arguments": { "x": { "from_node": "sat_r" }, "y": 1 } },
                    "rein_div_r": { "process_id": "divide", "arguments": { "x": { "from_node": "sat_r" }, "y": { "from_node": "rein_den_r" } } },
                    "rein_r": { "process_id": "multiply", "arguments": { "x": { "from_node": "rein_div_r" }, "y": 1.3333333333333333 } },

                    "rein_den_g": { "process_id": "add", "arguments": { "x": { "from_node": "sat_g" }, "y": 1 } },
                    "rein_div_g": { "process_id": "divide", "arguments": { "x": { "from_node": "sat_g" }, "y": { "from_node": "rein_den_g" } } },
                    "rein_g": { "process_id": "multiply", "arguments": { "x": { "from_node": "rein_div_g" }, "y": 1.3333333333333333 } },

                    "rein_den_b": { "process_id": "add", "arguments": { "x": { "from_node": "sat_b" }, "y": 1 } },
                    "rein_div_b": { "process_id": "divide", "arguments": { "x": { "from_node": "sat_b" }, "y": { "from_node": "rein_den_b" } } },
                    "rein_b": { "process_id": "multiply", "arguments": { "x": { "from_node": "rein_div_b" }, "y": 1.3333333333333333 } },

                    "gamma_r": { "process_id": "power", "arguments": { "base": { "from_node": "rein_r" }, "p": 0.8 } },
                    "gamma_g": { "process_id": "power", "arguments": { "base": { "from_node": "rein_g" }, "p": 0.8 } },
                    "gamma_b": { "process_id": "power", "arguments": { "base": { "from_node": "rein_b" }, "p": 0.8 } },

                    "clamp_r": { "process_id": "clip", "arguments": { "x": { "from_node": "gamma_r" }, "min": 0, "max": 1 } },
                    "clamp_g": { "process_id": "clip", "arguments": { "x": { "from_node": "gamma_g" }, "min": 0, "max": 1 } },
                    "clamp_b": { "process_id": "clip", "arguments": { "x": { "from_node": "gamma_b" }, "min": 0, "max": 1 } },

                    "vv_gt0": { "process_id": "gt", "arguments": { "x": { "from_node": "vv" }, "y": 0 } },
                    "vh_gt0": { "process_id": "gt", "arguments": { "x": { "from_node": "vh" }, "y": 0 } },

                    "vh_check_r": { "process_id": "if", "arguments": { "value": { "from_node": "vh_gt0" }, "accept": { "from_node": "clamp_r" }, "reject": 0 } },
                    "final_r": { "process_id": "if", "arguments": { "value": { "from_node": "vv_gt0" }, "accept": { "from_node": "vh_check_r" }, "reject": 0 } },

                    "vh_check_g": { "process_id": "if", "arguments": { "value": { "from_node": "vh_gt0" }, "accept": { "from_node": "clamp_g" }, "reject": 0 } },
                    "final_g": { "process_id": "if", "arguments": { "value": { "from_node": "vv_gt0" }, "accept": { "from_node": "vh_check_g" }, "reject": 0 } },

                    "vh_check_b": { "process_id": "if", "arguments": { "value": { "from_node": "vh_gt0" }, "accept": { "from_node": "clamp_b" }, "reject": 0 } },
                    "final_b": { "process_id": "if", "arguments": { "value": { "from_node": "vv_gt0" }, "accept": { "from_node": "vh_check_b" }, "reject": 0 } },

                    "arraycreate1": {
                        "process_id": "array_create",
                        "arguments": {
                            "data": [
                                { "from_node": "final_r" },
                                { "from_node": "final_g" },
                                { "from_node": "final_b" }
                            ]
                        },
                        "result": true
                    }
                }
            }
        }
    },
    "saveresult1": {
        "process_id": "save_result",
        "arguments": {
            "data": {
                "from_node": "applydimension1"
            },
            "format": "webp"
        },
        "result": true
    }
}
