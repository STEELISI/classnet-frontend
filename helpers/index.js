import Vue from 'vue'

export const artifactIcon = type => {
  switch (type) {
    case 'presentation':
      return 'mdi-presentation-play'
    case 'publication':
      return 'mdi-newspaper-variant-outline'
    case 'code':
      return 'mdi-code-braces'
    case 'pcap':
    case 'dag':
    case 'argus':
    case 'netflow':
    case 'flowtools':
    case 'flowride':
    case 'fsdb':
    case 'csv':
    case 'label':
      return 'mdi-label'
    case 'custom':
      return 'mdi-data-matrix'
    case 'keyword':
      return 'mdi-tag-outline'
    case 'role':
      return 'mdi-account-circle'
    case 'relation':
      return 'mdi-relation-one-to-one'
    case 'reverse-relation':
      return 'mdi-relation-one-to-one'
    case 'field':
      return 'mdi-text-box'
    default:
      return 'mdi-help'
  }
}

export const artifactColor = type => {
  switch (type) {
    case 'presentation':
      return 'orange white--text'
    case 'publication':
      return 'red white--text'
    case 'code':
     return 'purple white--text'
    case 'pcap':
      return 'purple white--text'
    case 'dag':
      return 'grey white--text'
    case 'argus':
      return 'green white--text'
    case 'label':
      return 'green white--text'
    case 'netflow':
      return 'orange white--text'
    case 'flowtools':
      return 'blue white--text'
    case 'flowride':
      return 'brown white--text'
    case 'fsdb':
      return 'black white--text'
    case 'csv':
      return 'cyan white--text'
    case 'custom':
        return 'blue lighten-2 white--text'
    case 'role':
      return 'primary'
    case 'relation':
      return 'primary'
    case 'reverse-relation':
      return 'primary'
    default:
      return 'info'
  }
}

export const reverseRelation = type => {
  switch (type) {
    case 'cites':
      return 'is cited by'
    case 'supplements':
      return 'is supplemented by'
    case 'extends':
      return 'is extended by'
    case 'uses':
      return 'is used by'
    case 'describes':
      return 'is described by'
    case 'requires':
      return 'is required by'
    case 'processes':
      return 'is processed by'
    case 'produces':
      return 'is produced by'
    default:
      return type
  }
}

export const bytesToSize = bytes => {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes == 0) return '0 Bytes'
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]
}

export const convertArrayToObject = (array, key) => {
  const initialValue = {}
  return array.reduce((obj, item) => {
    return {
      ...obj,
      [item[key]]: item
    }
  }, initialValue)
}

export const getCookie = (cookieName) => {
  let cookie = {};
  document.cookie.split(';').forEach(function(el) {
    let [key,value] = el.split('=');
    cookie[key.trim()] = value;
  })
  return cookie[cookieName];
}

export const zipArray = (tag, input) => {
  let zip = [[tag]]
  input.map(e => zip.push([e]))
  const mapWith = keys => values =>
      Object.fromEntries(keys.map((k, i) => [k, values[i]])),
    getArray = ([keys, ...zip]) => zip.map(mapWith(keys)),
    array = getArray(zip)
  return array
}

export const isReleased = status =>{
  if (status.toLowerCase() == "released"){
    return true
  }
  return false
}

export const EventBus = new Vue()

export const getCartGroupedByProviderCollection = (cart) => {
  let resultDict = {};

  if (!Array.isArray(cart)) {
    console.error('Provided cart is not an array');
    return {};
  }

  cart.forEach((obj) => {
    const provider = obj.provider;
    const collection = obj.collection;
    const artifact_id = obj.artifact_id;
    const artifact_group_id = obj.artifact_group_id;

    const key = [provider, collection];

    if (!resultDict[key]) {
      resultDict[key] = [];
    }

    resultDict[key].push([artifact_group_id, artifact_id]);
  });


  // Convert resultDict to the required format
  const cartGrouped = {};
  Object.keys(resultDict).forEach((key) => {
    // Convert key string back to array
    const [provider, collection] = key.split(',');
    cartGrouped[[provider, collection]] = {
      artifact_ids: resultDict[key],
      showDropdown: false
    };
  });
  return cartGrouped;
};
