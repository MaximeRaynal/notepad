'use strict';

var editor = null;

document.addEventListener('DOMContentLoaded', function(event) {

    // Loading old snippet
    getLocalSnippets().forEach(function (elmnt) {
        store(elmnt.content, elmnt.langage, elmnt.id, true);
    });

    // Configuring ace
    var path = 'js/lib/ace/src-min-noconflict';
    ace.config.set('basePath', path);

    editor = ace.edit('editor');
    editor.getSession().setMode('ace/mode/text');
    editor.setShowPrintMargin(false);
    editor.setHighlightActiveLine(true);

    editor.commands.addCommand({
    name: 'save',
    bindKey: {win: 'Ctrl-s',  mac: 'Command-s'},
        exec: stroreEvent,
        readOnly: true
    });

    // On clear le contenu du à l'indentation du HTML
    editor.setValue('');
    editor.focus();
    editor.getSession().setMode('ace/mode/text');

    // Binding event
    var langageSelector = document.getElementById('langage-selector');

    langageSelector.addEventListener('change', function (evnt) {
        editor.getSession().setMode('ace/mode/' + evnt.target.value);
    });

    var themeSelector = document.getElementById('theme-selector');


    themeSelector.addEventListener('change', function (evnt) {
        editor.setTheme(evnt.target.value);
    });

    var event = new Event('change');
    // Dispatch it.
    themeSelector.dispatchEvent(event);

    document.getElementById('save-btn').addEventListener('click', stroreEvent);

    document.getElementById('newButton').addEventListener('click', newEvent);

    // Clear du hash
    location.hash = '#new';

});

function stroreEvent() {
    var content = editor.getValue();
    var langage = document.getElementById('langage-selector').value;

    var id = location.hash;

    if (location.hash == '#new') {
        location.hash = uuid();
    }

    if (content !== '') {
        store(content, langage, location.hash, false);
    }
}

function store(content, langage, id, isLocalSaved) {

    var newSnippet = Template.render('snippet-template',
                                        {
                                            'content': content,
                                            'langage': langage,
                                            'id': id
                                        });

    newSnippet.addEventListener('click', restoreEvent, false);

    newSnippet.querySelector('.snippet-closer').addEventListener('click', remove, true);

    var saveBtn = newSnippet.querySelector('.snippet-saver');
    saveBtn.addEventListener('click', localSave, true);
    if (isLocalSaved) {
        saveBtn.classList.add('saved');
    }

    var old = document.querySelector('*[data-snippet-id="' + id + '"]');

    if (old !== null) {
        old.parentNode.insertBefore(newSnippet, old);
        old.remove();
    } else {
        document.getElementById('snippet-list').appendChild(newSnippet);
    }


}

function remove(evnt) {
    var id = this.parentNode.getAttribute('data-snippet-id');
    var data = getLocalSnippets();

    data = localRemove(data, id);

    localStorage.setItem('saved-snippets', JSON.stringify(data));

    this.parentNode.remove();
    evnt.stopPropagation();
}

function restoreEvent(evnt) {
    var content = this.firstChild.textContent;
    var langage = this.getAttribute('data-langage');
    var id = this.getAttribute('data-snippet-id');

    editor.setValue(content);
    editor.gotoLine(1); // To avoid text selection

    document.getElementById('langage-selector').value = langage;
    editor.getSession().setMode('ace/mode/' + langage);

    location.hash = id;
}

function newEvent() {
    editor.setValue('');
    editor.focus();
    location.hash = 'new';
}

function localSave(evnt) {
    var content = this.parentNode.firstChild.textContent;
    var langage = this.parentNode.getAttribute('data-langage');
    var id = this.parentNode.getAttribute('data-snippet-id');

    var data = getLocalSnippets();

    data = localRemove(data, id);

    data.push({
                'content': content,
                'langage': langage,
                'id': id
            });

    localStorage.setItem('saved-snippets', JSON.stringify(data));

    this.classList.add('saved');

    evnt.stopPropagation();
}

function localRemove(data, id) {

    var targetIndex = -1;

    data.forEach(function (elmnt, index) {
        if (elmnt.id == id) {
            targetIndex = index;
        }
    });

    if (targetIndex != -1) {
        data.splice(targetIndex)
    }

    return data;
}

function getLocalSnippets() {
    var data = localStorage.getItem('saved-snippets');

    if (data === null) {
        data = [];
    } else {
        data = JSON.parse(data);
    }

    return data;
}

