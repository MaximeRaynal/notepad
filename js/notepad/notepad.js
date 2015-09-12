'use strict';

var editor = null;

document.addEventListener('DOMContentLoaded', function(event) {

    var path = 'js/lib/ace/src-min-noconflict';
    ace.config.set('basePath', path);

    editor = ace.edit('editor');
    editor.setTheme('ace/theme/github');
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

    var langageSelector = document.getElementById('langage-selector');

    langageSelector.addEventListener('change', function (evnt) {
        editor.getSession().setMode('ace/mode/' + evnt.target.value);
    });

    var themeSelector = document.getElementById('theme-selector');

    themeSelector.addEventListener('change', function (evnt) {
        editor.setTheme(evnt.target.value);
    });

    document.getElementById('save-btn').addEventListener('click', stroreEvent);

});

function stroreEvent() {
    var content = editor.getValue();
    var langage = document.getElementById('langage-selector').value;

    if (content !== '') {
        store(content, langage);
    }
}

function store(content, langage) {

    var newSnippet = Template.render('snippet-template',
                                        {
                                            'content': content,
                                            'langage': langage
                                        });

    newSnippet.addEventListener('click', restore, false);

    newSnippet.querySelector('.snippet-closer').addEventListener('click', remove, false);

    document.getElementById('snippet-list').appendChild(newSnippet);
}

function remove(evnt) {
    evnt.target.parentNode.remove();
    evnt.preventDefault();
}

function restore(evnt) {
    var content = evnt.target.textContent;
    var langage = evnt.target.getAttribute('data-langage');

    editor.setValue(content);
    editor.gotoLine(1); // To avoid text selection

    document.getElementById('langage-selector').value = langage;

    editor.getSession().setMode('ace/mode/' + langage);
}