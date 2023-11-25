import {writable} from 'svelte/store'

export const all_data = writable({
  selected_mac_address: ''
})