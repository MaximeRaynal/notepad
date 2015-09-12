'use strict';

/**
 * "Moteur" de template minimaliste le but est de simplifié la créatoin
 * de "composant" pour par exemple coller à des données récupéré en ajax
 * Pas fait pour gérer des gros templates,
 * pas de compilation, pas de fonction.
 * Dans un premier temps les variables et ensuite du code libre, gestion d'une
 * valeur en cas d'abscence
 */

/**
 * Minimalistic "template engine".
 * The goal is to simplify "composant" creation, for exemple when use
 * ajax data to create DOM Element.
 * Not for big templates
 * No compilation, no functions.
 * Only access to passed variables and not found value.
 */
function Template() {

}

Template.config = {
    notFoundReplacment: null,
    htmlTrim: true

};

Template.config.templatesSelector = function() {
    return document.querySelectorAll('.template');
};

Template.variableRegex = /{{\s*([a-zA-Z][\w-\.]*)\s*}}/g;

Template.render = function (template, datas) {

    // Accept a Node or a Node Id
    if (typeof template === 'string') {
        template = document.getElementById(template);
    }

    if (template === null) {
        return null;
    }

    var result = template.innerHTML;

    // Remove useless withespace who can make style issues
    if (Template.config.htmlTrim) {
        result = result.trim().replace(/>(\s+)</g, '><');
        result = result.trim().replace(/>(\s+){/g, '>{');
        result = result.trim().replace(/}(\s+)</g, '}<');
    }

    var variable;
    while ((variable = Template.variableRegex.exec(template.innerHTML)) !== null) {
        var property = '';
        // Eval make eaysier the access to sub property
        eval('property = datas.' + variable[1]);
        if ( property === undefined  &&
                    Template.config.notFoundReplacment !== null) {
            result = result.replace(variable[0],
                                         Template.config.notFoundReplacment);
        } else {
            result = result.replace(variable[0], property);
        }
    }

    return Template.strToDOM(result);
};

// Not the worst way to turn a string in DOM Element
Template.strToDOM = function (s){
    var  d=document
        ,i
        ,a=d.createElement("div")
        ,b=d.createDocumentFragment();
    a.innerHTML=s;
    while(i=a.firstChild)b.appendChild(i);
    return b;
};

document.addEventListener('DOMContentLoaded', function() {
    // Hide know templates
    for (var template of Template.config.templatesSelector()) {
        template.setAttribute('hidden', '');
    }
});